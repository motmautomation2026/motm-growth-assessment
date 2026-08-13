import { renderToBuffer } from "@react-pdf/renderer";
import { ReportDocument } from "@/lib/pdf/report-document";
import { getAssessmentWithResponses } from "@/app/actions/assessment";
import type { ScoreResultOutput } from "@/lib/engine/scoring";
import type { CalculatorOutput } from "@/lib/engine/calculators";
import type { AIReportSections } from "@/lib/ai/generateReport";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const assessment = await getAssessmentWithResponses(id);

  if (!assessment || !assessment.scoreResult || !assessment.calculatorResult || !assessment.aiReport) {
    return new Response("Report not ready yet", { status: 404 });
  }

  const buffer = await renderToBuffer(
    <ReportDocument
      company={assessment.company}
      scores={assessment.scoreResult as ScoreResultOutput}
      calculators={assessment.calculatorResult as unknown as CalculatorOutput}
      sections={assessment.aiReport.sections as unknown as AIReportSections}
      generatedAt={assessment.aiReport.generatedAt}
      bookingUrl={process.env.NEXT_PUBLIC_BOOKING_URL || "mailto:hello@motm.tech"}
    />
  );

  const fileName = `${assessment.company.name.replace(/[^a-z0-9]+/gi, "-")}-growth-assessment.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${fileName}"`,
    },
  });
}
