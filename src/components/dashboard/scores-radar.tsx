"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CHART_BLUE } from "@/lib/chart-colors";
import type { ScoreResultOutput } from "@/lib/engine/scoring";

const LABELS: Record<keyof Omit<ScoreResultOutput, "overallScore">, string> = {
  icpScore: "ICP",
  salesScore: "Sales",
  marketingScore: "Marketing",
  automationScore: "Automation",
  crmScore: "CRM",
  leadGenScore: "Lead Gen",
  digitalPresenceScore: "Digital Presence",
};

export function ScoresRadar({ scores }: { scores: ScoreResultOutput }) {
  const data = (Object.keys(LABELS) as (keyof typeof LABELS)[]).map((key) => ({
    subject: LABELS[key],
    value: scores[key],
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} />
        <Radar
          name="Score"
          dataKey="value"
          stroke={CHART_BLUE}
          fill={CHART_BLUE}
          fillOpacity={0.28}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            fontSize: 12,
            color: "var(--popover-foreground)",
          }}
          formatter={(value) => [`${value}/100`, "Score"]}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
