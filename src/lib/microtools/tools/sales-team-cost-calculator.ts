import { HEURISTIC_CONSTANTS, type CurrencyCode } from "@/lib/currency";
import type { MicroToolDefinition } from "../types";

export const salesTeamCostCalculator: MicroToolDefinition = {
  slug: "in-house-sales-team-cost-calculator",
  category: "CALCULATOR",
  name: "In-House Sales Team Cost Calculator",
  ctaLabel: "Calculate the Real Cost of Hiring a Sales Team",
  tagline: "See the full loaded cost of an in-house sales team — not just salary.",
  description: "Salary is only part of the cost. Add overhead and your own review time to see the real number.",
  needsCurrency: true,
  fields: [
    { type: "number", name: "numSalespeople", label: "Number of Salespeople", min: 0 },
    { type: "number", name: "avgSalaryPerPerson", label: "Average Annual Salary / Person", min: 0 },
    { type: "number", name: "managerCostAnnual", label: "Sales Manager Cost / yr (optional)", min: 0, optional: true },
    { type: "number", name: "crmAnnualCost", label: "CRM Cost / yr (optional)", min: 0, optional: true },
    { type: "number", name: "databaseAnnualCost", label: "Database/Tools Cost / yr (optional)", min: 0, optional: true },
    { type: "number", name: "travelAnnualCost", label: "Travel Cost / yr (optional)", min: 0, optional: true },
    { type: "number", name: "trainingAnnualCost", label: "Training Cost / yr (optional)", min: 0, optional: true },
    {
      type: "number",
      name: "founderReviewHoursPerMonth",
      label: "Founder/Leadership Review Hours / mo (optional)",
      min: 0,
      optional: true,
    },
  ],
  compute: (input) => {
    const currency = (input.currency as CurrencyCode) ?? "INR";
    const founderHourlyValue = HEURISTIC_CONSTANTS[currency].founderHourlyValue;

    const numSalespeople = Number(input.numSalespeople) || 0;
    const avgSalaryPerPerson = Number(input.avgSalaryPerPerson) || 0;
    const overheadAnnual =
      (Number(input.managerCostAnnual) || 0) +
      (Number(input.crmAnnualCost) || 0) +
      (Number(input.databaseAnnualCost) || 0) +
      (Number(input.travelAnnualCost) || 0) +
      (Number(input.trainingAnnualCost) || 0);

    const salaryAnnual = numSalespeople * avgSalaryPerPerson;
    const totalAnnual = salaryAnnual + overheadAnnual;
    const monthlyCost = totalAnnual / 12;
    const hiddenCostAnnual = (Number(input.founderReviewHoursPerMonth) || 0) * 12 * founderHourlyValue;

    return {
      metrics: [
        { label: "Monthly Cost", value: Math.round(monthlyCost), format: "currency" },
        { label: "Annual Cost", value: Math.round(totalAnnual), format: "currency" },
        { label: "Hidden Cost / yr (est. leadership time)", value: Math.round(hiddenCostAnnual), format: "currency" },
        { label: "Fully-Loaded Annual Cost", value: Math.round(totalAnnual + hiddenCostAnnual), format: "currency" },
      ],
    };
  },
  aiSections: [{ key: "inHouseVsOutsource", label: "In-House vs. Outsourced", kind: "paragraph" }],
};
