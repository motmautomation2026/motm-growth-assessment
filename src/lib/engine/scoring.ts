import type {
  IcpInput,
  DecisionMakerInput,
  MarketingInput,
  BusinessGoalsInput,
} from "@/lib/validation/assessment";
import type { CalculatorOutput } from "@/lib/engine/calculators";

export type ScoreBand = "GREEN" | "YELLOW" | "RED";

export type ScoreResultOutput = {
  icpScore: number;
  salesScore: number;
  marketingScore: number;
  automationScore: number;
  crmScore: number;
  leadGenScore: number;
  digitalPresenceScore: number;
  overallScore: number;
};

export function scoreBand(score: number): ScoreBand {
  if (score >= 70) return "GREEN";
  if (score >= 40) return "YELLOW";
  return "RED";
}

const channelValue = (level: "NONE" | "PARTIAL" | "FULL") =>
  level === "FULL" ? 100 : level === "PARTIAL" ? 50 : 0;

const avg = (values: number[]) =>
  values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;

function scoreIcp(icp: IcpInput): number {
  const fields = [
    icp.whatYouSell,
    icp.whoBuysIt,
    icp.targetIndustries,
    icp.idealDealSize,
    icp.buyingFrequency,
    icp.problemSolved,
    icp.customerSize,
    icp.idealGeography,
    icp.primaryCompetitors,
    icp.existingCustomers,
  ];
  // Completeness + specificity proxy: a well-defined ICP has substantive answers
  // across all ten dimensions, not just the required minimum.
  const completeness = avg(
    fields.map((f) => Math.min(((f?.trim().length ?? 0) / 25) * 100, 100))
  );
  return Math.round(completeness);
}

function scoreDecisionMakers(dm: DecisionMakerInput): number {
  const clarity = avg(
    [dm.whoApproves, dm.whoInfluences, dm.whoPays, dm.budgetOwner].map((f) =>
      Math.min((f.trim().length / 15) * 100, 100)
    )
  );
  const processMaturity =
    (dm.hasBuyingCommittee !== "NO" ? 34 : 10) +
    (dm.procurementInvolved !== "NO" ? 33 : 15) +
    (dm.ceoApprovalRequired !== "YES" ? 33 : 20);
  return Math.round(clarity * 0.5 + Math.min(processMaturity, 100) * 0.5);
}

function scoreSales(calc: CalculatorOutput): number {
  const closeRateScore = Math.min((calc.closeRate / 35) * 100, 100);
  const pipelineScore = calc.pipelineHealth;
  return Math.round(closeRateScore * 0.5 + pipelineScore * 0.5);
}

function scoreMarketing(marketing: MarketingInput): number {
  return avg(Object.values(marketing).map(channelValue));
}

function scoreAutomation(marketing: MarketingInput): number {
  return Math.round(channelValue(marketing.automation) * 0.6 + channelValue(marketing.crm) * 0.4);
}

function scoreCrm(marketing: MarketingInput, decisionMakerScore: number): number {
  return Math.round(channelValue(marketing.crm) * 0.7 + decisionMakerScore * 0.3);
}

function scoreLeadGen(marketing: MarketingInput, calc: CalculatorOutput): number {
  const channelScore = avg(
    [marketing.seo, marketing.linkedin, marketing.coldEmail, marketing.emailMarketing, marketing.tradeShows, marketing.content].map(
      channelValue
    )
  );
  const volumeScore = Math.min((calc.leadConversionRate / 50) * 100, 100);
  return Math.round(channelScore * 0.7 + volumeScore * 0.3);
}

function scoreDigitalPresence(marketing: MarketingInput): number {
  return avg([marketing.website, marketing.seo, marketing.analytics, marketing.content].map(channelValue));
}

export function calculateScores(input: {
  icp: IcpInput;
  decisionMaker: DecisionMakerInput;
  marketing: MarketingInput;
  calculators: CalculatorOutput;
  // Reserved for future weighting by stated business goals.
  businessGoals?: BusinessGoalsInput;
}): ScoreResultOutput {
  const icpScore = scoreIcp(input.icp);
  const decisionMakerScore = scoreDecisionMakers(input.decisionMaker);
  const salesScore = scoreSales(input.calculators);
  const marketingScore = scoreMarketing(input.marketing);
  const automationScore = scoreAutomation(input.marketing);
  const crmScore = scoreCrm(input.marketing, decisionMakerScore);
  const leadGenScore = scoreLeadGen(input.marketing, input.calculators);
  const digitalPresenceScore = scoreDigitalPresence(input.marketing);

  const overallScore = Math.round(
    icpScore * 0.15 +
      salesScore * 0.2 +
      marketingScore * 0.15 +
      automationScore * 0.1 +
      crmScore * 0.1 +
      leadGenScore * 0.15 +
      digitalPresenceScore * 0.15
  );

  return {
    icpScore,
    salesScore,
    marketingScore,
    automationScore,
    crmScore,
    leadGenScore,
    digitalPresenceScore,
    overallScore,
  };
}
