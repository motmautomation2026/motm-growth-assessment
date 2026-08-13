import type { SalesFunnelInput } from "@/lib/validation/assessment";

export type FunnelStageLeakage = {
  stage: string;
  from: number;
  to: number;
  conversionRate: number;
  dropOff: number;
};

export type CalculatorOutput = {
  leadConversionRate: number;
  meetingRate: number;
  rfqRate: number;
  closeRate: number;
  leadLeakage: FunnelStageLeakage[];
  weakestStage: string;
  revenueLeakage: number;
  cac: number | null;
  pipelineHealth: number;
  salesVelocity: number;
  roi: number | null;
  estimatedLostRevenue: number;
  estimatedGrowthOpportunity: number;
};

const pct = (numerator: number, denominator: number) =>
  denominator > 0 ? Math.round((numerator / denominator) * 1000) / 10 : 0;

// Healthy B2B/manufacturing benchmark conversion rate for each funnel transition.
// Used only to flag the weakest stage and size the growth opportunity, not as ground truth.
const BENCHMARK_STAGE_RATE: Record<string, number> = {
  "Leads → Qualified": 50,
  "Qualified → Meetings": 60,
  "Meetings → RFQs": 50,
  "RFQs → Proposals": 70,
  "Proposals → Orders": 35,
};

export function calculateFunnelMetrics(
  funnel: SalesFunnelInput,
  avgDealSize: number
): CalculatorOutput {
  const { monthlyLeads, qualifiedLeads, meetings, rfqs, proposals, orders, revenue, salesCycleDays, monthlySpend } =
    funnel;

  const leadConversionRate = pct(qualifiedLeads, monthlyLeads);
  const meetingRate = pct(meetings, qualifiedLeads);
  const rfqRate = pct(rfqs, meetings);
  const closeRate = pct(orders, proposals);

  const stages: { stage: string; from: number; to: number }[] = [
    { stage: "Leads → Qualified", from: monthlyLeads, to: qualifiedLeads },
    { stage: "Qualified → Meetings", from: qualifiedLeads, to: meetings },
    { stage: "Meetings → RFQs", from: meetings, to: rfqs },
    { stage: "RFQs → Proposals", from: rfqs, to: proposals },
    { stage: "Proposals → Orders", from: proposals, to: orders },
  ];

  const leadLeakage: FunnelStageLeakage[] = stages.map((s) => ({
    stage: s.stage,
    from: s.from,
    to: s.to,
    conversionRate: pct(s.to, s.from),
    dropOff: Math.max(s.from - s.to, 0),
  }));

  // Weakest stage = biggest gap versus its benchmark conversion rate (only among stages with volume).
  // Must seed the reduce with the *filtered* array's own first element — seeding with the raw
  // leadLeakage[0] would let a zero-volume stage (0% "conversion", giant fake gap) win by default
  // whenever it happens to sit earlier in the funnel than the real bottleneck.
  const stagesWithVolumeForWeakest = leadLeakage.filter((s) => s.from > 0);
  const weakest =
    stagesWithVolumeForWeakest.length > 0
      ? stagesWithVolumeForWeakest.reduce((worst, current) => {
          const benchmark = BENCHMARK_STAGE_RATE[current.stage] ?? 50;
          const gap = benchmark - current.conversionRate;
          const worstBenchmark = BENCHMARK_STAGE_RATE[worst.stage] ?? 50;
          const worstGap = worstBenchmark - worst.conversionRate;
          return gap > worstGap ? current : worst;
        }, stagesWithVolumeForWeakest[0])
      : leadLeakage[0];

  const weakestStage = weakest.stage;

  const benchmarkOverallConversion =
    Object.values(BENCHMARK_STAGE_RATE).reduce((acc, r) => acc * (r / 100), 1);

  const potentialOrdersAtBenchmark = monthlyLeads * benchmarkOverallConversion;
  const estimatedLostRevenue = Math.max(
    (potentialOrdersAtBenchmark - orders) * avgDealSize,
    0
  );

  const revenueLeakage = estimatedLostRevenue;

  const cac = monthlySpend && orders > 0 ? Math.round((monthlySpend / orders) * 100) / 100 : null;
  const roi =
    monthlySpend && monthlySpend > 0 ? Math.round(((revenue - monthlySpend) / monthlySpend) * 1000) / 10 : null;

  // Pipeline health: how close each stage's actual conversion is to benchmark, averaged and capped at 100.
  const stagesWithVolume = leadLeakage.filter((s) => s.from > 0);
  const pipelineHealth =
    stagesWithVolume.length > 0
      ? Math.round(
          stagesWithVolume.reduce((sum, s) => {
            const benchmark = BENCHMARK_STAGE_RATE[s.stage] ?? 50;
            return sum + Math.min(s.conversionRate / benchmark, 1) * 100;
          }, 0) / stagesWithVolume.length
        )
      : 0;

  // Classic sales velocity: (# opportunities x win rate x avg deal size) / cycle length.
  const winRate = proposals > 0 ? orders / proposals : 0;
  const salesVelocity =
    salesCycleDays > 0 ? Math.round(((proposals * winRate * avgDealSize) / salesCycleDays) * 100) / 100 : 0;

  const estimatedGrowthOpportunity = Math.round(estimatedLostRevenue * 1.5 * 100) / 100;

  return {
    leadConversionRate,
    meetingRate,
    rfqRate,
    closeRate,
    leadLeakage,
    weakestStage,
    revenueLeakage: Math.round(revenueLeakage * 100) / 100,
    cac,
    pipelineHealth,
    salesVelocity,
    roi,
    estimatedLostRevenue: Math.round(estimatedLostRevenue * 100) / 100,
    estimatedGrowthOpportunity,
  };
}
