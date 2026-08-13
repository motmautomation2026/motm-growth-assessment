import { scoreBand } from "@/lib/engine/scoring";
import type { MicroToolDefinition } from "../types";

const pct = (num: number, den: number) => (den > 0 ? Math.round((num / den) * 1000) / 10 : 0);

export const funnelHealthCheck: MicroToolDefinition = {
  slug: "sales-funnel-health-check",
  category: "DIAGNOSTIC",
  name: "B2B Sales Funnel Health Check",
  ctaLabel: "Check If Your B2B Sales Funnel Is Working",
  tagline: "A 60-second check on whether your funnel is actually working.",
  description: "We'll score your lead-to-meeting, meeting-to-RFQ, and RFQ-to-order rates, plus your process discipline.",
  fields: [
    { type: "number", name: "monthlyLeads", label: "Monthly Leads", min: 0 },
    { type: "number", name: "meetings", label: "Meetings / mo", min: 0 },
    { type: "number", name: "rfqs", label: "RFQs / mo", min: 0 },
    { type: "number", name: "orders", label: "Orders Won / mo", min: 0 },
    { type: "select", name: "weeklyPipelineReview", label: "Do you review pipeline weekly?", options: ["Yes", "No"] },
    { type: "select", name: "leadSourceTracking", label: "Do you track lead source?", options: ["Yes", "No"] },
  ],
  compute: (input) => {
    const monthlyLeads = Number(input.monthlyLeads) || 0;
    const meetings = Number(input.meetings) || 0;
    const rfqs = Number(input.rfqs) || 0;
    const orders = Number(input.orders) || 0;

    const leadToMeeting = pct(meetings, monthlyLeads);
    const meetingToRfq = pct(rfqs, meetings);
    const rfqToOrder = pct(orders, rfqs);

    const rateScore =
      Math.min(leadToMeeting / 50, 1) * 40 + Math.min(meetingToRfq / 50, 1) * 30 + Math.min(rfqToOrder / 35, 1) * 30;
    const processBonus =
      (input.weeklyPipelineReview === "Yes" ? 0 : -10) + (input.leadSourceTracking === "Yes" ? 0 : -10);
    const score = Math.max(0, Math.min(100, Math.round(rateScore + processBonus)));

    const stages = [
      { name: "Lead → Meeting", rate: leadToMeeting },
      { name: "Meeting → RFQ", rate: meetingToRfq },
      { name: "RFQ → Order", rate: rfqToOrder },
    ];
    const weakest = stages.reduce((worst, s) => (s.rate < worst.rate ? s : worst), stages[0]);

    return {
      headline: { label: "Funnel Health Score", score, band: scoreBand(score) },
      metrics: [
        { label: "Lead → Meeting", value: `${leadToMeeting}%` },
        { label: "Meeting → RFQ", value: `${meetingToRfq}%` },
        { label: "RFQ → Order", value: `${rfqToOrder}%` },
        { label: "Weakest Stage", value: weakest.name },
      ],
    };
  },
};
