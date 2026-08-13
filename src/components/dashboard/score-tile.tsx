import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ScoreBand } from "@/lib/engine/scoring";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/chart-colors";

const BAND_ICON: Record<ScoreBand, typeof CheckCircle2> = {
  GREEN: CheckCircle2,
  YELLOW: AlertTriangle,
  RED: XCircle,
};

export function ScoreTile({
  label,
  score,
  band,
  emphasize,
}: {
  label: string;
  score: number;
  band: ScoreBand;
  emphasize?: boolean;
}) {
  const Icon = BAND_ICON[band];
  const color = STATUS_COLORS[band];

  return (
    <Card size="sm" className={emphasize ? "ring-2 ring-primary" : undefined}>
      <CardContent className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-end gap-2">
          <span className="font-heading text-3xl font-semibold tabular-nums">{score}</span>
          <span className="mb-1 text-sm text-muted-foreground">/100</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color }}>
          <Icon className="size-3.5" />
          {STATUS_LABELS[band]}
        </div>
      </CardContent>
    </Card>
  );
}
