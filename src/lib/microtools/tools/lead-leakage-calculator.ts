import { scoreBand } from "@/lib/engine/scoring";
import type { MicroToolDefinition } from "../types";

export const leadLeakageCalculator: MicroToolDefinition = {
  slug: "lead-leakage-cost-calculator",
  category: "CALCULATOR",
  name: "Lead Leakage Cost Calculator",
  ctaLabel: "Estimate Revenue Lost Due to Weak Follow-Up",
  tagline: "Put a number on the revenue you're not following up.",
  description: "A handful of numbers reveal how much revenue is leaking out of your funnel every month.",
  needsCurrency: true,
  fields: [
    { type: "number", name: "monthlyLeads", label: "Monthly Leads", min: 0 },
    { type: "number", name: "dealValue", label: "Average Deal Value", min: 0 },
    { type: "number", name: "conversionRate", label: "Current Close Rate (%)", min: 0 },
    { type: "number", name: "leadsNotFollowedUp", label: "Leads Not Followed Up / mo", min: 0 },
    { type: "number", name: "pendingQuotations", label: "Pending Quotations Right Now", min: 0 },
    { type: "number", name: "grossMarginPercent", label: "Gross Margin (%)", min: 0 },
  ],
  compute: (input) => {
    const monthlyLeads = Number(input.monthlyLeads) || 0;
    const dealValue = Number(input.dealValue) || 0;
    const conversionRate = Number(input.conversionRate) || 0;
    const leadsNotFollowedUp = Number(input.leadsNotFollowedUp) || 0;
    const grossMarginPercent = Number(input.grossMarginPercent) || 0;

    const potentialRevenueLeakage = leadsNotFollowedUp * (conversionRate / 100) * dealValue;
    const marginLeakage = potentialRevenueLeakage * (grossMarginPercent / 100);
    const followUpRiskPct = monthlyLeads > 0 ? Math.min(100, Math.round((leadsNotFollowedUp / monthlyLeads) * 100)) : 0;
    const followUpHealthScore = 100 - followUpRiskPct;
    const risk = followUpRiskPct >= 60 ? "High" : followUpRiskPct >= 30 ? "Medium" : "Low";

    return {
      headline: { label: "Follow-Up Health Score", score: followUpHealthScore, band: scoreBand(followUpHealthScore) },
      metrics: [
        { label: "Potential Revenue Leakage / mo", value: Math.round(potentialRevenueLeakage), format: "currency" },
        { label: "Margin Leakage / mo", value: Math.round(marginLeakage), format: "currency" },
        { label: "Follow-Up Risk", value: risk },
        { label: "Pending Quotations", value: String(input.pendingQuotations ?? 0) },
      ],
    };
  },
  aiSections: [{ key: "cadenceRecommendation", label: "Recommended Follow-Up Cadence", kind: "paragraph" }],
};
