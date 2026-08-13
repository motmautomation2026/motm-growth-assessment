import { HEURISTIC_CONSTANTS, type CurrencyCode } from "@/lib/currency";
import type { MicroToolDefinition } from "../types";

export const regionalExpansionCalculator: MicroToolDefinition = {
  slug: "regional-expansion-cost-calculator",
  category: "CALCULATOR",
  name: "Regional Expansion Cost Calculator",
  ctaLabel: "Compare Local Hiring vs Outsourced Regional Sales Expansion",
  tagline: "Compare the cost of hiring locally vs. testing a region with outsourced execution.",
  description: "A few numbers about your target region give you a side-by-side cost comparison.",
  needsCurrency: true,
  fields: [
    { type: "text", name: "targetRegion", label: "Target Region", placeholder: "e.g. Southeast Asia" },
    { type: "number", name: "localMonthlySalary", label: "Local Salesperson Monthly Salary", min: 0 },
    { type: "number", name: "monthlyTravelBudget", label: "Monthly Travel Budget (optional)", min: 0, optional: true },
    {
      type: "number",
      name: "managerCostSharePercent",
      label: "Manager Time Allocated (%, optional)",
      min: 0,
      optional: true,
      hint: "% of a manager's time spent overseeing this region",
    },
    { type: "number", name: "monthlyDatabaseCost", label: "Monthly Database/Tools Cost (optional)", min: 0, optional: true },
    { type: "number", name: "outreachVolume", label: "Target Monthly Outreach Contacts", min: 0 },
    { type: "number", name: "timelineMonths", label: "Expansion Timeline (months)", min: 1 },
  ],
  compute: (input) => {
    const currency = (input.currency as CurrencyCode) ?? "INR";
    const { assumedManagerMonthlySalary, outreachUnitCost } = HEURISTIC_CONSTANTS[currency];

    const localMonthlySalary = Number(input.localMonthlySalary) || 0;
    const monthlyTravelBudget = Number(input.monthlyTravelBudget) || 0;
    const managerCostSharePercent = Number(input.managerCostSharePercent) || 0;
    const monthlyDatabaseCost = Number(input.monthlyDatabaseCost) || 0;
    const outreachVolume = Number(input.outreachVolume) || 0;
    const timelineMonths = Number(input.timelineMonths) || 1;

    const managerCostShare = (managerCostSharePercent / 100) * assumedManagerMonthlySalary;
    const localHiringMonthlyCost = localMonthlySalary + monthlyTravelBudget + monthlyDatabaseCost + managerCostShare;
    const outsourcingTestMonthlyCost = outreachVolume * outreachUnitCost;

    return {
      metrics: [
        { label: "Local Hiring Cost / mo", value: Math.round(localHiringMonthlyCost), format: "currency" },
        { label: "Outsourced Test Cost / mo (est.)", value: Math.round(outsourcingTestMonthlyCost), format: "currency" },
        {
          label: `Total Local Cost over ${timelineMonths}mo`,
          value: Math.round(localHiringMonthlyCost * timelineMonths),
          format: "currency",
        },
      ],
    };
  },
  aiSections: [{ key: "regionalActionPlan", label: "30-Day Regional Action Plan", kind: "list" }],
};
