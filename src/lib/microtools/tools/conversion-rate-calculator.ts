import type { MicroToolDefinition } from "../types";

const pct = (num: number, den: number) => (den > 0 ? Math.round((num / den) * 1000) / 10 : 0);

export const conversionRateCalculator: MicroToolDefinition = {
  slug: "b2b-conversion-rate-calculator",
  category: "CALCULATOR",
  name: "B2B Conversion Rate Calculator",
  ctaLabel: "Calculate Your B2B Sales Conversion Rate",
  tagline: "See your conversion rate at every stage of the funnel.",
  description: "Enter your monthly funnel counts and get an instant conversion-rate breakdown.",
  fields: [
    { type: "number", name: "totalLeads", label: "Total Leads / mo", min: 0 },
    { type: "number", name: "qualifiedLeads", label: "Qualified Leads / mo", min: 0 },
    { type: "number", name: "meetings", label: "Meetings / mo", min: 0 },
    { type: "number", name: "rfqs", label: "RFQs / mo", min: 0 },
    { type: "number", name: "quotations", label: "Quotations / mo", min: 0 },
    { type: "number", name: "closures", label: "Closures (Orders Won) / mo", min: 0 },
  ],
  compute: (input) => {
    const totalLeads = Number(input.totalLeads) || 0;
    const qualifiedLeads = Number(input.qualifiedLeads) || 0;
    const meetings = Number(input.meetings) || 0;
    const rfqs = Number(input.rfqs) || 0;
    const quotations = Number(input.quotations) || 0;
    const closures = Number(input.closures) || 0;

    return {
      metrics: [
        { label: "Lead → Qualified", value: `${pct(qualifiedLeads, totalLeads)}%` },
        { label: "Qualified → Meeting", value: `${pct(meetings, qualifiedLeads)}%` },
        { label: "Meeting → RFQ", value: `${pct(rfqs, meetings)}%` },
        { label: "RFQ → Quotation", value: `${pct(quotations, rfqs)}%` },
        { label: "Quotation → Order", value: `${pct(closures, quotations)}%` },
        { label: "Overall Conversion (Lead → Order)", value: `${pct(closures, totalLeads)}%` },
      ],
    };
  },
};
