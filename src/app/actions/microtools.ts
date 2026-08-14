"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getToolBySlug } from "@/lib/microtools/registry";
import { buildFormSchema } from "@/lib/microtools/form-schema";
import { generateMicroToolSummary } from "@/lib/microtools/ai";
import { sendMicroToolReportEmail } from "@/lib/email";
import { rateLimitSubmission } from "@/lib/rate-limit";
import { notifyMicroToolSubmitted } from "@/lib/notify";
import type { CurrencyCode } from "@/lib/currency";

export async function submitMicroTool(slug: string, raw: unknown) {
  const tool = getToolBySlug(slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);

  const schema = buildFormSchema(tool.fields, tool.needsCurrency);
  const data = schema.parse(raw) as Record<string, unknown> & {
    contactName: string;
    email: string;
    companyName: string;
    phone: string;
    currency?: string;
  };

  const { contactName, email, companyName, phone, currency, ...toolInputs } = data;
  await rateLimitSubmission("microtool_submit", email);
  const resolvedCurrency = currency ?? "INR";
  // Keep currency available to compute() (heuristic $-per-unit constants read it)
  // even though it's also stored as its own column below.
  const output = tool.compute({ ...toolInputs, currency: resolvedCurrency });

  const submission = await prisma.microToolSubmission.create({
    data: {
      toolSlug: slug,
      category: tool.category,
      email,
      contactName,
      companyName,
      phone,
      currency: resolvedCurrency,
      inputs: toolInputs as never,
      outputs: output as never,
      status: "SCORED",
      submittedAt: new Date(),
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  await notifyMicroToolSubmitted({
    contactName,
    email,
    phone,
    companyName,
    toolName: tool.name,
    resultUrl: `${baseUrl}/tools/${slug}/result/${submission.id}`,
  });

  redirect(`/tools/${slug}/processing/${submission.id}`);
}

export async function getMicroToolSubmission(id: string) {
  return prisma.microToolSubmission.findUnique({ where: { id } });
}

export async function ensureMicroToolAiSummary(id: string) {
  const submission = await prisma.microToolSubmission.findUnique({ where: { id } });
  if (!submission) throw new Error("Submission not found");
  if (submission.aiSummary) return submission;

  const tool = getToolBySlug(submission.toolSlug);
  if (!tool) throw new Error(`Unknown tool: ${submission.toolSlug}`);

  const summary = await generateMicroToolSummary({
    toolName: tool.name,
    inputs: submission.inputs as Record<string, unknown>,
    outputs: (submission.outputs as Record<string, unknown>) ?? {},
    extraSections: tool.aiSections,
    currency: submission.currency as CurrencyCode,
  });

  const updated = await prisma.microToolSubmission.update({
    where: { id },
    data: { aiSummary: summary as never, status: "REPORT_GENERATED" },
  });

  if (submission.email) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    await sendMicroToolReportEmail({
      to: submission.email,
      contactName: submission.contactName || "there",
      toolName: tool.name,
      resultUrl: `${baseUrl}/tools/${submission.toolSlug}/result/${id}`,
      pdfUrl: `${baseUrl}/api/tools/${submission.toolSlug}/${id}/report`,
      bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || "mailto:hello@motm.tech",
    });
  }

  return updated;
}
