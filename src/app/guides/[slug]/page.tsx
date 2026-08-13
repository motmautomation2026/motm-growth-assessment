import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { getGuideBySlug } from "@/lib/microtools/pdf-guides";
import { submitGuideLead } from "@/app/actions/guides";
import { ToolShell } from "@/components/microtools/tool-shell";
import { GuideLeadForm } from "@/components/guides/guide-lead-form";
import type { GuideLeadInput } from "@/lib/validation/guide";

export default async function GuideGatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  async function handleSubmit(data: GuideLeadInput) {
    "use server";
    await submitGuideLead(slug, data);
  }

  return (
    <ToolShell title={guide.title} tagline="Enter your details below and we'll take you straight to the download.">
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-secondary/25 p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(to_bottom_right,var(--primary-glow),var(--primary))] text-primary-foreground">
          <FileText className="size-5" />
        </span>
        <div>
          <p className="text-sm font-medium">{guide.title}</p>
          <p className="text-xs text-muted-foreground">Free PDF guide · Instant access</p>
        </div>
      </div>
      <GuideLeadForm onSubmitAction={handleSubmit} />
    </ToolShell>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  return { title: guide ? `${guide.title} — MOTM` : "MOTM Guides" };
}
