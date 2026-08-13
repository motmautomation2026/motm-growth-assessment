import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/microtools/registry";
import { getMicroToolSubmission } from "@/app/actions/microtools";
import { ToolShell } from "@/components/microtools/tool-shell";
import { MicroToolResultView } from "@/components/microtools/result-view";
import type { MicroToolOutput } from "@/lib/microtools/types";
import type { MicroToolAiSummary } from "@/lib/microtools/ai";
import type { CurrencyCode } from "@/lib/currency";

export default async function ToolResultPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const submission = await getMicroToolSubmission(id);
  if (!submission || submission.toolSlug !== slug) notFound();

  if (submission.status === "IN_PROGRESS" || submission.status === "DRAFT") {
    redirect(`/tools/${slug}`);
  }
  if (!submission.aiSummary) {
    redirect(`/tools/${slug}/processing/${id}`);
  }

  const output = submission.outputs as unknown as MicroToolOutput;
  const aiSummary = submission.aiSummary as unknown as MicroToolAiSummary;
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "mailto:hello@motm.tech";

  // Bandwidth-protection rule: only surface a direct "book a call" CTA to
  // high-fit leads (currently: a strong Sales Outsourcing Readiness score).
  // Everyone else gets a soft cross-link up the ladder to the full assessment.
  const isHighFitSignal = slug === "sales-outsourcing-readiness-score" && (output.headline?.band === "GREEN");

  return (
    <ToolShell title={`Your ${tool.name} Results`} tagline={`Prepared for ${submission.companyName}`}>
      <div className="space-y-8">
        <MicroToolResultView output={output} aiSummary={aiSummary} currency={submission.currency as CurrencyCode} />

        <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={`/api/tools/${slug}/${id}/report`} target="_blank" />}
          >
            <Download /> Download PDF
          </Button>

          {isHighFitSignal ? (
            <Button nativeButton={false} render={<a href={bookingUrl} target="_blank" rel="noopener noreferrer" />}>
              Book a Consultation
            </Button>
          ) : (
            <Button nativeButton={false} render={<Link href="/assessment/start" />}>
              Get the Full Growth Assessment <ArrowRight />
            </Button>
          )}
        </div>

        {!isHighFitSignal ? (
          <p className="text-center text-sm text-muted-foreground">
            Want to talk instead?{" "}
            <a href={bookingUrl} className="text-primary underline">
              Book a consultation
            </a>{" "}
            any time.
          </p>
        ) : null}
      </div>
    </ToolShell>
  );
}
