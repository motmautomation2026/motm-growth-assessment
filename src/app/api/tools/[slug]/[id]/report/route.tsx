import { renderToBuffer } from "@react-pdf/renderer";
import { getToolBySlug } from "@/lib/microtools/registry";
import { getMicroToolSubmission } from "@/app/actions/microtools";
import { MicroToolReportDocument } from "@/lib/pdf/microtool-report-document";
import type { MicroToolOutput } from "@/lib/microtools/types";
import type { MicroToolAiSummary } from "@/lib/microtools/ai";
import type { CurrencyCode } from "@/lib/currency";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return new Response("Unknown tool", { status: 404 });

  const submission = await getMicroToolSubmission(id);
  if (!submission || submission.toolSlug !== slug || !submission.aiSummary) {
    return new Response("Report not ready yet", { status: 404 });
  }

  const buffer = await renderToBuffer(
    <MicroToolReportDocument
      toolName={tool.name}
      contactName={submission.contactName || "there"}
      companyName={submission.companyName || ""}
      output={submission.outputs as unknown as MicroToolOutput}
      aiSummary={submission.aiSummary as unknown as MicroToolAiSummary}
      generatedAt={submission.updatedAt}
      bookingUrl={process.env.NEXT_PUBLIC_BOOKING_URL || "mailto:hello@motm.tech"}
      currency={submission.currency as CurrencyCode}
      fields={tool.fields}
      inputs={submission.inputs as Record<string, unknown>}
    />
  );

  const fileName = `${tool.slug}-${(submission.companyName || "report").replace(/[^a-z0-9]+/gi, "-")}.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${fileName}"`,
    },
  });
}
