import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/chart-colors";
import { formatCurrency, type CurrencyCode } from "@/lib/currency";
import type { MicroToolOutput } from "@/lib/microtools/types";
import type { MicroToolAiSummary } from "@/lib/microtools/ai";
import type { ScoreBand } from "@/lib/engine/scoring";

const BAND_ICON: Record<ScoreBand, typeof CheckCircle2> = {
  GREEN: CheckCircle2,
  YELLOW: AlertTriangle,
  RED: XCircle,
};

export function MicroToolResultView({
  output,
  aiSummary,
  currency = "INR",
}: {
  output: MicroToolOutput;
  aiSummary?: MicroToolAiSummary;
  currency?: CurrencyCode;
}) {
  const Icon = output.headline ? BAND_ICON[output.headline.band] : null;

  return (
    <div className="space-y-6">
      {output.headline ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
            <p className="text-sm text-muted-foreground">{output.headline.label}</p>
            <p className="font-heading text-5xl font-semibold tabular-nums">
              {output.headline.score}
              <span className="text-xl text-muted-foreground">/100</span>
            </p>
            <div
              className="flex items-center gap-1.5 text-sm font-medium"
              style={{ color: STATUS_COLORS[output.headline.band] }}
            >
              {Icon ? <Icon className="size-4" /> : null}
              {STATUS_LABELS[output.headline.band]}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {output.metrics?.length ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {output.metrics.map((m) => (
            <Card key={m.label} size="sm">
              <CardContent>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="mt-1 font-heading text-xl font-semibold tabular-nums">
                  {"format" in m && m.format === "currency" ? formatCurrency(m.value, currency) : m.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {output.sections?.map((s) => (
        <Card key={s.label}>
          <CardHeader>
            <CardTitle className="font-heading text-lg">{s.label}</CardTitle>
          </CardHeader>
          <CardContent>
            {Array.isArray(s.body) ? (
              <ul className="space-y-2 text-sm text-muted-foreground">
                {s.body.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            )}
          </CardContent>
        </Card>
      ))}

      {aiSummary?.extraSections.map((s) => (
        <Card key={s.label}>
          <CardHeader>
            <CardTitle className="font-heading text-lg">{s.label}</CardTitle>
          </CardHeader>
          <CardContent>
            {Array.isArray(s.body) ? (
              <ul className="space-y-2 text-sm text-muted-foreground">
                {s.body.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            )}
          </CardContent>
        </Card>
      ))}

      {aiSummary ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">What This Means</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{aiSummary.whatThisMeans}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">30-Day Action Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-muted-foreground">
                {aiSummary.actionPlan.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-medium text-foreground">{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">MOTM Relevance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{aiSummary.motmRelevance}</p>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
