import type { MicroToolDefinition, MicroToolMetric } from "../types";

const pct = (num: number, den: number) => (den > 0 ? Math.round((num / den) * 1000) / 10 : 0);

export const salesFunnelWorksheet: MicroToolDefinition = {
  slug: "sales-funnel-mapping-worksheet",
  category: "WORKSHEET",
  name: "Sales Funnel Mapping Worksheet",
  ctaLabel: "Map Your Current B2B Sales Funnel",
  tagline: "See your funnel stage-by-stage and find the weakest link.",
  description: "Enter your monthly funnel numbers and we'll break down conversion at every stage.",
  fields: [
    { type: "number", name: "monthlyLeads", label: "Monthly Leads", min: 0 },
    { type: "number", name: "outboundLeads", label: "Outbound Leads / mo", min: 0, optional: true },
    { type: "number", name: "firstCalls", label: "First Calls / mo", min: 0 },
    { type: "number", name: "qualifiedLeads", label: "Qualified Leads / mo", min: 0 },
    { type: "number", name: "meetings", label: "Meetings / mo", min: 0 },
    { type: "number", name: "rfqs", label: "RFQs / mo", min: 0 },
    { type: "number", name: "quotations", label: "Quotations Sent / mo", min: 0 },
    { type: "number", name: "closures", label: "Closures (Orders Won) / mo", min: 0 },
    { type: "number", name: "dealSize", label: "Average Deal Size", min: 0 },
    { type: "number", name: "salesCycle", label: "Average Sales Cycle (days)", min: 1 },
  ],
  compute: (input) => {
    const monthlyLeads = Number(input.monthlyLeads) || 0;
    const firstCalls = Number(input.firstCalls) || 0;
    const qualifiedLeads = Number(input.qualifiedLeads) || 0;
    const meetings = Number(input.meetings) || 0;
    const rfqs = Number(input.rfqs) || 0;
    const quotations = Number(input.quotations) || 0;
    const closures = Number(input.closures) || 0;

    const stages: { name: string; from: number; to: number }[] = [
      { name: "Leads → First Call", from: monthlyLeads, to: firstCalls },
      { name: "First Call → Qualified", from: firstCalls, to: qualifiedLeads },
      { name: "Qualified → Meeting", from: qualifiedLeads, to: meetings },
      { name: "Meeting → RFQ", from: meetings, to: rfqs },
      { name: "RFQ → Quotation", from: rfqs, to: quotations },
      { name: "Quotation → Closure", from: quotations, to: closures },
    ];

    const rates = stages.map((s) => ({ ...s, rate: pct(s.to, s.from) }));
    const withVolume = rates.filter((s) => s.from > 0);
    const weakest = withVolume.length
      ? withVolume.reduce((worst, s) => (s.rate < worst.rate ? s : worst), withVolume[0])
      : rates[0];

    const metrics: MicroToolMetric[] = rates.map((s) => ({ label: s.name, value: `${s.rate}%` }));

    return {
      metrics,
      sections: [
        { label: "Weakest Stage", body: `${weakest.name} (${weakest.rate}% conversion)` },
        {
          label: "Conversion Gaps",
          body: rates
            .filter((s) => s.from > 0 && s.rate < 40)
            .map((s) => `${s.name}: only ${s.rate}% convert — ${s.from - s.to} dropped off this stage`),
        },
      ],
    };
  },
  aiSections: [{ key: "improvementArea", label: "Recommended Improvement Area", kind: "paragraph" }],
};
