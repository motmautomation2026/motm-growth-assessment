"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { CHART_BLUE } from "@/lib/chart-colors";
import type { CalculatorOutput } from "@/lib/engine/calculators";

export function MetricsBarChart({ calculators }: { calculators: CalculatorOutput }) {
  const data = [
    { name: "Lead → Qualified", value: calculators.leadConversionRate },
    { name: "Qualified → Meeting", value: calculators.meetingRate },
    { name: "Meeting → RFQ", value: calculators.rfqRate },
    { name: "Proposal → Close", value: calculators.closeRate },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="name"
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          axisLine={{ stroke: "var(--border)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          unit="%"
        />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            fontSize: 12,
            color: "var(--popover-foreground)",
          }}
          formatter={(value) => [`${value}%`, "Conversion"]}
        />
        <Bar dataKey="value" fill={CHART_BLUE} radius={[4, 4, 0, 0]} maxBarSize={56}>
          <LabelList
            dataKey="value"
            position="top"
            formatter={(v) => `${v}%`}
            fill="var(--foreground)"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
