import { formatCurrency, HEURISTIC_CONSTANTS, type CurrencyCode } from "@/lib/currency";
import type { MicroToolDefinition } from "../types";

// Calibrated so an ordinary Pan-India + moderate-cadence + standard-tooling scenario lands
// mid-range (~60), not pinned at the 100 ceiling — only the most demanding combination
// (international + intensive cadence + many industries + full tooling) should approach 100.
const GEOGRAPHY_WEIGHT: Record<string, number> = {
  "Single City": 8,
  "Single State/Region": 18,
  "Pan-India": 32,
  International: 48,
};

const CADENCE_WEIGHT: Record<string, number> = {
  "Light (1-2 touches)": 6,
  "Moderate (3-5 touches)": 14,
  "Intensive (6+ touches, multi-channel)": 24,
};

export const leadGenBudgetCalculator: MicroToolDefinition = {
  slug: "b2b-lead-generation-budget-calculator",
  category: "CALCULATOR",
  name: "B2B Lead Generation Budget Calculator",
  ctaLabel: "Estimate Your B2B Lead Generation Budget",
  tagline: "Get a directional monthly budget range for your outreach goals.",
  description: "A few questions about your target market and outreach volume give you a starting budget range.",
  needsCurrency: true,
  fields: [
    {
      type: "select",
      name: "targetGeography",
      label: "Target geography",
      options: ["Single City", "Single State/Region", "Pan-India", "International"],
    },
    { type: "number", name: "numIndustries", label: "Number of Target Industries", min: 1 },
    { type: "number", name: "outreachVolume", label: "Target Monthly Outreach Contacts", min: 0 },
    {
      type: "select",
      name: "cadenceIntensity",
      label: "Follow-up cadence intensity",
      options: ["Light (1-2 touches)", "Moderate (3-5 touches)", "Intensive (6+ touches, multi-channel)"],
    },
    { type: "select", name: "callingNeeded", label: "Is outbound calling needed?", options: ["Yes", "No"] },
    { type: "select", name: "databaseNeeded", label: "Is a contact database needed?", options: ["Yes", "No"] },
    { type: "select", name: "crmNeeded", label: "Is a CRM needed?", options: ["Yes", "No"] },
    { type: "number", name: "salesCycleDays", label: "Average Sales Cycle (days)", min: 1 },
  ],
  compute: (input) => {
    const currency = (input.currency as CurrencyCode) ?? "INR";
    const baseCostPerContact = HEURISTIC_CONSTANTS[currency].outreachUnitCost;

    const numIndustries = Number(input.numIndustries) || 1;
    const outreachVolume = Number(input.outreachVolume) || 0;
    const salesCycleDays = Number(input.salesCycleDays) || 30;

    const geoWeight = GEOGRAPHY_WEIGHT[String(input.targetGeography)] ?? 18;
    const cadenceWeight = CADENCE_WEIGHT[String(input.cadenceIntensity)] ?? 14;
    const toolingWeight =
      (input.callingNeeded === "Yes" ? 3 : 0) + (input.databaseNeeded === "Yes" ? 3 : 0) + (input.crmNeeded === "Yes" ? 3 : 0);

    const complexityScore = Math.min(
      100,
      Math.round(geoWeight + Math.min(numIndustries * 3, 15) + cadenceWeight + toolingWeight)
    );

    const complexityMultiplier = 1 + complexityScore / 200;
    const minBudget = outreachVolume * baseCostPerContact * 0.7 * complexityMultiplier;
    const maxBudget = outreachVolume * baseCostPerContact * 1.3 * complexityMultiplier;

    const executionModel =
      complexityScore >= 70
        ? "Fully Outsourced Execution Recommended"
        : complexityScore >= 40
          ? "Hybrid (Internal + Outsourced Support)"
          : "DIY / Small Internal Team";

    const rampUpWeeks = Math.round(4 + complexityScore / 15 + salesCycleDays / 30);

    return {
      metrics: [
        {
          label: "Estimated Monthly Budget",
          value: `${formatCurrency(minBudget, currency)} - ${formatCurrency(maxBudget, currency)}`,
        },
        { label: "Complexity Score", value: `${complexityScore}/100` },
        { label: "Recommended Execution Model", value: executionModel },
        { label: "Estimated Ramp-Up Time", value: `${rampUpWeeks} weeks` },
      ],
    };
  },
};
