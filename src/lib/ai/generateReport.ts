import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { CURRENCY_SYMBOLS, type CurrencyCode } from "@/lib/currency";
import type { ScoreResultOutput } from "@/lib/engine/scoring";
import type { CalculatorOutput } from "@/lib/engine/calculators";
import type {
  IcpInput,
  DecisionMakerInput,
  SalesFunnelInput,
  MarketingInput,
  BusinessGoalsInput,
  CompanyInfoInput,
} from "@/lib/validation/assessment";

const aiReportSchema = z.object({
  executiveSummary: z.string(),
  businessSnapshot: z.string(),
  icpAnalysis: z.string(),
  decisionMakerAnalysis: z.string(),
  salesFunnelAnalysis: z.string(),
  marketingAnalysis: z.string(),
  leadGenerationAnalysis: z.string(),
  automationAnalysis: z.string(),
  digitalPresenceAnalysis: z.string(),
  competitorReadiness: z.string(),
  growthOpportunities: z.array(z.string()),
  risks: z.array(z.string()),
  quickWins: z.array(z.string()),
  plan30Days: z.array(z.string()),
  plan60Days: z.array(z.string()),
  plan90Days: z.array(z.string()),
});

export type AIReportSections = z.infer<typeof aiReportSchema>;

export type AIReportInput = {
  company: Pick<
    CompanyInfoInput,
    "companyName" | "industry" | "employees" | "revenueRange" | "targetMarket" | "avgDealSize" | "currency"
  >;
  icp: IcpInput;
  decisionMaker: DecisionMakerInput;
  salesFunnel: SalesFunnelInput;
  marketing: MarketingInput;
  businessGoals: BusinessGoalsInput;
  scores: ScoreResultOutput;
  calculators: CalculatorOutput;
};

const SYSTEM_PROMPT = `You are a senior B2B/manufacturing sales & marketing growth consultant writing a section-by-section
analysis for a company's Growth Assessment report. You are interpreting data that has already been
collected and scored - do not invent numbers. Every claim must trace back to the provided scores,
calculator results, or worksheet answers. Be specific, direct, and consultative, not generic. Write
in a confident, professional tone suitable for a $199/month premium SaaS deliverable. Avoid filler
phrases like "in today's competitive landscape."`;

function buildUserPrompt(input: AIReportInput): string {
  return JSON.stringify(
    {
      company: input.company,
      icpWorksheet: input.icp,
      decisionMakerMapping: input.decisionMaker,
      salesFunnel: input.salesFunnel,
      marketingChannels: input.marketing,
      businessGoals: input.businessGoals,
      scores: input.scores,
      calculatedMetrics: input.calculators,
    },
    null,
    2
  );
}

export async function generateAIReport(input: AIReportInput): Promise<{
  sections: AIReportSections;
  model: string;
  raw: unknown;
}> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is not configured. Set it in .env to enable AI report generation."
    );
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const currency = (input.company.currency as CurrencyCode) ?? "INR";
  const currencySymbol = CURRENCY_SYMBOLS[currency];
  const currencyInstruction = `\n\nAll monetary amounts in the data below are in ${currency} — always write them using the "${currencySymbol}" symbol (e.g. "${currencySymbol}50,000"), never $ or any other currency symbol unless the currency is explicitly USD.`;

  const completion = await openai.chat.completions.parse({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT + currencyInstruction },
      {
        role: "user",
        content: `Here is the company's assessment data as JSON. Generate the report sections.\n\n${buildUserPrompt(
          input
        )}`,
      },
    ],
    response_format: zodResponseFormat(aiReportSchema, "growth_assessment_report"),
  });

  const parsed = completion.choices[0]?.message.parsed;
  if (!parsed) {
    throw new Error("AI report generation returned no parsed content");
  }

  return { sections: parsed, model, raw: completion };
}
