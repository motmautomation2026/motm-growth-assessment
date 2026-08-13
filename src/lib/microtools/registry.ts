import type { MicroToolDefinition } from "./types";
import { icpWorksheet } from "./tools/icp-worksheet";
import { decisionMakerWorksheet } from "./tools/decision-maker-worksheet";
import { oemWorksheet } from "./tools/oem-worksheet";
import { salesFunnelWorksheet } from "./tools/sales-funnel-worksheet";
import { funnelHealthCheck } from "./tools/funnel-health-check";
import { leadQualityDiagnostic } from "./tools/lead-quality-diagnostic";
import { followUpDiscipline } from "./tools/follow-up-discipline";
import { outsourcingReadiness } from "./tools/outsourcing-readiness";
import { conversionRateCalculator } from "./tools/conversion-rate-calculator";
import { leadLeakageCalculator } from "./tools/lead-leakage-calculator";
import { salesTeamCostCalculator } from "./tools/sales-team-cost-calculator";
import { leadGenBudgetCalculator } from "./tools/lead-gen-budget-calculator";
import { regionalExpansionCalculator } from "./tools/regional-expansion-calculator";

export const MICRO_TOOLS: MicroToolDefinition[] = [
  icpWorksheet,
  decisionMakerWorksheet,
  oemWorksheet,
  salesFunnelWorksheet,
  funnelHealthCheck,
  leadQualityDiagnostic,
  followUpDiscipline,
  outsourcingReadiness,
  conversionRateCalculator,
  leadLeakageCalculator,
  salesTeamCostCalculator,
  leadGenBudgetCalculator,
  regionalExpansionCalculator,
];

export function getToolBySlug(slug: string): MicroToolDefinition | undefined {
  return MICRO_TOOLS.find((t) => t.slug === slug);
}
