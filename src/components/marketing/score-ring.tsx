import { STATUS_COLORS, STATUS_LABELS } from "@/lib/chart-colors";
import type { ScoreBand } from "@/lib/engine/scoring";

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreRing({
  value,
  band,
  label,
}: {
  value: number;
  band: ScoreBand;
  label?: string;
}) {
  const offset = CIRCUMFERENCE * (1 - value / 100);
  const color = STATUS_COLORS[band];

  return (
    <div className="flex items-center gap-4">
      <svg width="88" height="88" viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="var(--border)" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div>
        <p className="font-heading text-2xl font-semibold tabular-nums">
          {value}
          <span className="text-sm text-muted-foreground">/100</span>
        </p>
        <p className="text-xs font-medium" style={{ color }}>
          {label ?? STATUS_LABELS[band]}
        </p>
      </div>
    </div>
  );
}
