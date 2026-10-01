import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Download, CalendarCheck } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreTile } from "@/components/dashboard/score-tile";
import { ScoresRadar } from "@/components/dashboard/scores-radar";
import { SalesFunnelChart } from "@/components/dashboard/funnel-chart";
import { MetricsBarChart } from "@/components/dashboard/metrics-bar-chart";
import { AIReportView } from "@/components/dashboard/ai-report-sections";
import { getAssessmentWithResponses } from "@/app/actions/assessment";
import { scoreBand, type ScoreResultOutput } from "@/lib/engine/scoring";
import type { CalculatorOutput, FunnelStageLeakage } from "@/lib/engine/calculators";
import type { AIReportSections } from "@/lib/ai/generateReport";
import { formatCurrency, type CurrencyCode } from "@/lib/currency";

const SCORE_LABELS: { key: keyof ScoreResultOutput; label: string }[] = [
  { key: "icpScore", label: "ICP Fit" },
  { key: "salesScore", label: "Sales" },
  { key: "marketingScore", label: "Marketing" },
  { key: "automationScore", label: "Automation" },
  { key: "crmScore", label: "CRM" },
  { key: "leadGenScore", label: "Lead Generation" },
  { key: "digitalPresenceScore", label: "Digital Presence" },
];

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const assessment = await getAssessmentWithResponses(id);
  if (!assessment) notFound();

  if (assessment.status === "IN_PROGRESS" || assessment.status === "DRAFT") {
    redirect(`/assessment/${id}/step/${assessment.currentStep || 2}`);
  }
  if (!assessment.scoreResult || !assessment.calculatorResult) {
    redirect(`/assessment/${id}/processing`);
  }

  const scores = assessment.scoreResult as ScoreResultOutput;
  const calculators = assessment.calculatorResult as unknown as CalculatorOutput;
  const leakage = calculators.leadLeakage as unknown as FunnelStageLeakage[];
  const overallBand = scoreBand(scores.overallScore);
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "mailto:hello@motm.tech";
  const currencyCode = assessment.company.currency as CurrencyCode;
  const currency = (n: number) => formatCurrency(n, currencyCode);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-6">
        <Link href="https://www.motm.tech/" className="flex items-center gap-2 font-heading text-base font-semibold tracking-tight">
          <Logo size={88} />
        </Link>
        <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground">
          Free Tools
        </Link>
      </div>

      <header className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Growth Assessment Results</p>
          <h1 className="font-heading text-3xl font-bold tracking-tight">{assessment.company.name}</h1>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={`/api/assessment/${id}/report`} target="_blank" />}
          >
            <Download /> Download PDF Report
          </Button>
          <Button nativeButton={false} render={<a href={bookingUrl} target="_blank" rel="noopener noreferrer" />}>
            <CalendarCheck /> Book a Consultation
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreTile label="Overall Growth Score" score={scores.overallScore} band={overallBand} emphasize />
          {SCORE_LABELS.map(({ key, label }) => (
            <ScoreTile key={key} label={label} score={scores[key]} band={scoreBand(scores[key])} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Growth Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ScoresRadar scores={scores} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Sales Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesFunnelChart leakage={leakage} />
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Weakest stage: <span className="font-medium text-foreground">{calculators.weakestStage}</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Conversion Rates by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <MetricsBarChart calculators={calculators} />
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Estimated Lost Revenue / mo" value={currency(calculators.estimatedLostRevenue)} />
          <StatTile label="Growth Opportunity / mo" value={currency(calculators.estimatedGrowthOpportunity)} />
          <StatTile label="Pipeline Health" value={`${calculators.pipelineHealth}/100`} />
          <StatTile label="Sales Velocity / day" value={currency(calculators.salesVelocity)} />
          {calculators.cac !== null ? <StatTile label="Customer Acquisition Cost" value={currency(calculators.cac)} /> : null}
          {calculators.roi !== null ? <StatTile label="Marketing/Sales ROI" value={`${calculators.roi}%`} /> : null}
        </div>

        {assessment.aiReport ? (
          <AIReportView sections={assessment.aiReport.sections as unknown as AIReportSections} />
        ) : (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Your AI report is still being generated.{" "}
              <Link href={`/assessment/${id}/processing`} className="text-primary underline">
                Refresh
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <Card size="sm">
      <CardContent>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 font-heading text-xl font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}
