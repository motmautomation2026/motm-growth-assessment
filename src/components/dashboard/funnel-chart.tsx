"use client";

import { FunnelChart, Funnel, Cell, LabelList, Tooltip, ResponsiveContainer } from "recharts";
import { FUNNEL_RAMP } from "@/lib/chart-colors";
import type { FunnelStageLeakage } from "@/lib/engine/calculators";

const STAGE_NAMES = ["Leads", "Qualified", "Meetings", "RFQs", "Proposals", "Orders"];

export function SalesFunnelChart({ leakage }: { leakage: FunnelStageLeakage[] }) {
  const stageValues = [leakage[0]?.from ?? 0, ...leakage.map((s) => s.to)];

  const data = STAGE_NAMES.map((name, i) => ({
    name,
    value: stageValues[i] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <FunnelChart>
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            fontSize: 12,
            color: "var(--popover-foreground)",
          }}
        />
        <Funnel dataKey="value" data={data} isAnimationActive>
          <LabelList
            position="right"
            dataKey="name"
            fill="var(--foreground)"
            stroke="none"
            fontSize={12}
          />
          <LabelList
            position="center"
            dataKey="value"
            fill="#ffffff"
            stroke="none"
            fontSize={13}
            fontWeight={600}
          />
          {data.map((_, index) => (
            <Cell key={index} fill={FUNNEL_RAMP[index % FUNNEL_RAMP.length]} />
          ))}
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
}
