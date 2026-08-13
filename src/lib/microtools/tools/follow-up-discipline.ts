import { scoreBand } from "@/lib/engine/scoring";
import type { MicroToolDefinition } from "../types";

const riskFromScore = (score: number) => (score >= 70 ? "Low" : score >= 40 ? "Medium" : "High");

export const followUpDiscipline: MicroToolDefinition = {
  slug: "follow-up-discipline-score",
  category: "DIAGNOSTIC",
  name: "Follow-Up Discipline Score",
  ctaLabel: "Check Your Sales Follow-Up Discipline Score",
  tagline: "Find your lead leakage and quotation leakage risk.",
  description: "Five questions about your follow-up process reveal how much revenue is leaking through the cracks.",
  fields: [
    {
      type: "select",
      name: "followUpCadence",
      label: "Follow-up cadence",
      options: ["Structured cadence (CRM-driven)", "Occasional follow-up", "No consistent cadence"],
    },
    { type: "select", name: "crmUse", label: "Do you use a CRM?", options: ["Yes", "Partial", "No"] },
    { type: "select", name: "quotationTrackingLevel", label: "Do you track quotations to close?", options: ["Yes", "Partial", "No"] },
    { type: "select", name: "oldLeadRevival", label: "Do you revive old/cold leads?", options: ["Yes", "Occasionally", "No"] },
    { type: "select", name: "weeklyManagementReview", label: "Weekly management review of follow-ups?", options: ["Yes", "No"] },
  ],
  compute: (input) => {
    const cadenceScore =
      input.followUpCadence === "Structured cadence (CRM-driven)" ? 100 : input.followUpCadence === "Occasional follow-up" ? 50 : 0;
    const crmScore = input.crmUse === "Yes" ? 100 : input.crmUse === "Partial" ? 50 : 0;
    const quotationScore = input.quotationTrackingLevel === "Yes" ? 100 : input.quotationTrackingLevel === "Partial" ? 50 : 0;
    const revivalScore = input.oldLeadRevival === "Yes" ? 100 : input.oldLeadRevival === "Occasionally" ? 50 : 0;
    const reviewScore = input.weeklyManagementReview === "Yes" ? 100 : 0;

    const score = Math.round((cadenceScore + crmScore + quotationScore + revivalScore + reviewScore) / 5);
    const quotationRisk = riskFromScore(quotationScore);
    const leadLeakageRisk = riskFromScore(Math.round((cadenceScore + crmScore + revivalScore) / 3));

    return {
      headline: { label: "Follow-Up Discipline Score", score, band: scoreBand(score) },
      metrics: [
        { label: "Lead Leakage Risk", value: leadLeakageRisk },
        { label: "Quotation Leakage Risk", value: quotationRisk },
      ],
    };
  },
};
