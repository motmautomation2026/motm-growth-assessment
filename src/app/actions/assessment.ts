"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { calculateFunnelMetrics } from "@/lib/engine/calculators";
import { calculateScores } from "@/lib/engine/scoring";
import { generateAIReport } from "@/lib/ai/generateReport";
import { sendReportEmail } from "@/lib/email";
import { rateLimitSubmission } from "@/lib/rate-limit";
import { notifyAssessmentCompleted } from "@/lib/notify";
import type { CurrencyCode } from "@/lib/currency";
import {
  step1Schema,
  icpSchema,
  decisionMakerSchema,
  salesFunnelSchema,
  marketingSchema,
  businessGoalsSchema,
  type Step1Input,
  type IcpInput,
  type DecisionMakerInput,
  type SalesFunnelInput,
  type MarketingInput,
  type BusinessGoalsInput,
} from "@/lib/validation/assessment";

const ASSESSMENT_COOKIE = "motm_assessment_id";
const COOKIE_MAX_AGE_DAYS = 30;

async function rememberAssessment(assessmentId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ASSESSMENT_COOKIE, assessmentId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE_DAYS * 24 * 60 * 60,
    path: "/",
  });
}

export async function getResumableAssessmentId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ASSESSMENT_COOKIE)?.value ?? null;
}

export async function startAssessment(input: Step1Input) {
  const data = step1Schema.parse(input);
  await rateLimitSubmission("assessment_start", data.email);

  const user = await prisma.user.upsert({
    where: { email: data.email },
    update: { name: data.contactName, phone: data.phone, jobTitle: data.jobTitle },
    create: {
      email: data.email,
      name: data.contactName,
      phone: data.phone,
      jobTitle: data.jobTitle,
    },
  });

  const company = await prisma.company.create({
    data: {
      name: data.companyName,
      website: data.website || null,
      industry: data.industry,
      products: data.products || null,
      services: data.services || null,
      countries: data.countries,
      employees: data.employees,
      revenueRange: data.revenueRange,
      targetMarket: data.targetMarket || null,
      currency: data.currency,
      avgDealSize: data.avgDealSize,
    },
  });

  const assessment = await prisma.assessment.create({
    data: {
      companyId: company.id,
      userId: user.id,
      status: "IN_PROGRESS",
      // currentStep means "the furthest step the user is allowed to reach" (see
      // the skip-ahead guard in step/[step]/page.tsx and saveStep's step+1 logic
      // below). Step 1 (company info) is handled outside the numbered step
      // flow, so completing it means step 2 is now unlocked — not step 1.
      currentStep: 2,
    },
  });

  await prisma.auditLog.create({
    data: { assessmentId: assessment.id, userId: user.id, action: "ASSESSMENT_STARTED" },
  });

  await rememberAssessment(assessment.id);
  redirect(`/assessment/${assessment.id}/step/2`);
}

const STEP_SAVE_HANDLERS: Record<
  number,
  (assessmentId: string, raw: unknown) => Promise<void>
> = {
  2: async (assessmentId, raw) => {
    const data: IcpInput = icpSchema.parse(raw);
    await prisma.iCPResponse.upsert({
      where: { assessmentId },
      update: { answers: data },
      create: { assessmentId, answers: data },
    });
  },
  3: async (assessmentId, raw) => {
    const data: DecisionMakerInput = decisionMakerSchema.parse(raw);
    await prisma.decisionMakerResponse.upsert({
      where: { assessmentId },
      update: { answers: data },
      create: { assessmentId, answers: data },
    });
  },
  4: async (assessmentId, raw) => {
    const data: SalesFunnelInput = salesFunnelSchema.parse(raw);
    await prisma.salesFunnelResponse.upsert({
      where: { assessmentId },
      update: {
        monthlyLeads: data.monthlyLeads,
        qualifiedLeads: data.qualifiedLeads,
        meetings: data.meetings,
        rfqs: data.rfqs,
        proposals: data.proposals,
        orders: data.orders,
        revenue: data.revenue,
        salesCycleDays: data.salesCycleDays,
        leadSources: data.leadSources,
        followUpProcess: data.followUpProcess || null,
        monthlySpend: data.monthlySpend ?? null,
      },
      create: {
        assessmentId,
        monthlyLeads: data.monthlyLeads,
        qualifiedLeads: data.qualifiedLeads,
        meetings: data.meetings,
        rfqs: data.rfqs,
        proposals: data.proposals,
        orders: data.orders,
        revenue: data.revenue,
        salesCycleDays: data.salesCycleDays,
        leadSources: data.leadSources,
        followUpProcess: data.followUpProcess || null,
        monthlySpend: data.monthlySpend ?? null,
      },
    });
  },
  5: async (assessmentId, raw) => {
    const data: MarketingInput = marketingSchema.parse(raw);
    await prisma.marketingResponse.upsert({
      where: { assessmentId },
      update: data,
      create: { assessmentId, ...data },
    });
  },
  6: async (assessmentId, raw) => {
    const data: BusinessGoalsInput = businessGoalsSchema.parse(raw);
    await prisma.businessGoalsResponse.upsert({
      where: { assessmentId },
      update: { goals: data.goals },
      create: { assessmentId, goals: data.goals },
    });
  },
};

export async function saveStep(assessmentId: string, step: number, raw: unknown) {
  const handler = STEP_SAVE_HANDLERS[step];
  if (!handler) throw new Error(`No save handler for step ${step}`);

  await handler(assessmentId, raw);

  const nextStep = Math.max(step + 1, 1);
  await prisma.assessment.update({
    where: { id: assessmentId },
    data: { currentStep: Math.min(nextStep, 6) },
  });
}

export async function getAssessmentWithResponses(assessmentId: string) {
  return prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: {
      company: true,
      user: true,
      icpResponse: true,
      decisionMakerResponse: true,
      salesFunnelResponse: true,
      marketingResponse: true,
      businessGoalsResponse: true,
      scoreResult: true,
      calculatorResult: true,
      aiReport: true,
    },
  });
}

export async function submitAssessment(assessmentId: string) {
  const assessment = await getAssessmentWithResponses(assessmentId);
  if (!assessment) throw new Error("Assessment not found");
  if (
    !assessment.icpResponse ||
    !assessment.decisionMakerResponse ||
    !assessment.salesFunnelResponse ||
    !assessment.marketingResponse ||
    !assessment.businessGoalsResponse
  ) {
    throw new Error("Assessment is incomplete");
  }

  const salesFunnel = salesFunnelSchema.parse({
    monthlyLeads: assessment.salesFunnelResponse.monthlyLeads,
    qualifiedLeads: assessment.salesFunnelResponse.qualifiedLeads,
    meetings: assessment.salesFunnelResponse.meetings,
    rfqs: assessment.salesFunnelResponse.rfqs,
    proposals: assessment.salesFunnelResponse.proposals,
    orders: assessment.salesFunnelResponse.orders,
    revenue: assessment.salesFunnelResponse.revenue,
    salesCycleDays: assessment.salesFunnelResponse.salesCycleDays,
    leadSources: assessment.salesFunnelResponse.leadSources,
    followUpProcess: assessment.salesFunnelResponse.followUpProcess ?? undefined,
    monthlySpend: assessment.salesFunnelResponse.monthlySpend ?? undefined,
  });

  const marketing = marketingSchema.parse(assessment.marketingResponse);
  const icp = icpSchema.parse(assessment.icpResponse.answers);
  const decisionMaker = decisionMakerSchema.parse(assessment.decisionMakerResponse.answers);

  const calculators = calculateFunnelMetrics(salesFunnel, assessment.company.avgDealSize ?? 0);
  const scores = calculateScores({ icp, decisionMaker, marketing, calculators });

  await prisma.$transaction([
    prisma.calculatorResult.upsert({
      where: { assessmentId },
      update: calculators,
      create: { assessmentId, ...calculators },
    }),
    prisma.scoreResult.upsert({
      where: { assessmentId },
      update: scores,
      create: { assessmentId, ...scores },
    }),
    prisma.assessment.update({
      where: { id: assessmentId },
      data: { status: "SCORED", submittedAt: new Date(), currentStep: 6 },
    }),
    prisma.auditLog.create({
      data: { assessmentId, action: "ASSESSMENT_SUBMITTED" },
    }),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  await notifyAssessmentCompleted({
    contactName: assessment.user?.name || "there",
    email: assessment.user?.email || "unknown",
    phone: assessment.user?.phone,
    companyName: assessment.company.name,
    overallScore: scores.overallScore,
    dashboardUrl: `${baseUrl}/assessment/${assessmentId}/dashboard`,
  });

  redirect(`/assessment/${assessmentId}/processing`);
}

export async function ensureAIReport(assessmentId: string) {
  const existing = await prisma.aIReport.findUnique({ where: { assessmentId } });
  if (existing) return existing;

  const assessment = await getAssessmentWithResponses(assessmentId);
  if (!assessment || !assessment.scoreResult || !assessment.calculatorResult) {
    throw new Error("Assessment has not been scored yet");
  }
  if (
    !assessment.icpResponse ||
    !assessment.decisionMakerResponse ||
    !assessment.salesFunnelResponse ||
    !assessment.marketingResponse ||
    !assessment.businessGoalsResponse
  ) {
    throw new Error("Assessment is incomplete");
  }

  const { sections, model, raw } = await generateAIReport({
    company: {
      companyName: assessment.company.name,
      industry: assessment.company.industry ?? "",
      employees: assessment.company.employees ?? "",
      revenueRange: assessment.company.revenueRange ?? "",
      targetMarket: assessment.company.targetMarket ?? undefined,
      avgDealSize: assessment.company.avgDealSize ?? 0,
      currency: assessment.company.currency as CurrencyCode,
    },
    icp: icpSchema.parse(assessment.icpResponse.answers),
    decisionMaker: decisionMakerSchema.parse(assessment.decisionMakerResponse.answers),
    salesFunnel: salesFunnelSchema.parse({
      ...assessment.salesFunnelResponse,
      followUpProcess: assessment.salesFunnelResponse.followUpProcess ?? undefined,
      monthlySpend: assessment.salesFunnelResponse.monthlySpend ?? undefined,
    }),
    marketing: marketingSchema.parse(assessment.marketingResponse),
    businessGoals: businessGoalsSchema.parse(assessment.businessGoalsResponse),
    scores: assessment.scoreResult,
    calculators: {
      ...assessment.calculatorResult,
      leadLeakage: assessment.calculatorResult.leadLeakage as never,
    },
  });

  const report = await prisma.aIReport.create({
    data: {
      assessmentId,
      model,
      rawResponse: raw as never,
      sections: sections as never,
    },
  });

  await prisma.assessment.update({
    where: { id: assessmentId },
    data: { status: "REPORT_GENERATED" },
  });

  if (assessment.user?.email) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "mailto:hello@motm.tech";
    const result = await sendReportEmail({
      to: assessment.user.email,
      contactName: assessment.user.name || "there",
      companyName: assessment.company.name,
      overallScore: assessment.scoreResult.overallScore,
      dashboardUrl: `${baseUrl}/assessment/${assessmentId}/dashboard`,
      pdfUrl: `${baseUrl}/api/assessment/${assessmentId}/report`,
      bookingUrl,
    });

    if (result.status !== "SKIPPED") {
      await prisma.emailLog.create({
        data: {
          assessmentId,
          to: assessment.user.email,
          subject: `Your ${assessment.company.name} Growth Assessment Results`,
          status: result.status,
          sentAt: result.status === "SENT" ? new Date() : null,
        },
      });
    }
  }

  return report;
}
