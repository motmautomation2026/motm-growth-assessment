"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getGuideBySlug } from "@/lib/microtools/pdf-guides";
import { guideLeadSchema } from "@/lib/validation/guide";
import { rateLimitSubmission } from "@/lib/rate-limit";
import { notifyGuideDownloaded } from "@/lib/notify";

export async function submitGuideLead(slug: string, raw: unknown) {
  const guide = getGuideBySlug(slug);
  if (!guide) throw new Error(`Unknown guide: ${slug}`);

  const data = guideLeadSchema.parse(raw);
  await rateLimitSubmission("guide_download", data.email);

  await prisma.guideLead.create({
    data: {
      guideSlug: guide.slug,
      guideTitle: guide.title,
      contactName: data.contactName,
      email: data.email,
      companyName: data.companyName,
      phone: data.phone || null,
    },
  });

  await notifyGuideDownloaded({
    contactName: data.contactName,
    email: data.email,
    companyName: data.companyName,
    guideTitle: guide.title,
  });

  redirect(guide.href);
}
