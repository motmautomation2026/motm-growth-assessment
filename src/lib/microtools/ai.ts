import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { CURRENCY_SYMBOLS, type CurrencyCode } from "@/lib/currency";
import type { AiSectionSpec, MicroToolSection } from "./types";

export type MicroToolAiSummary = {
  whatThisMeans: string;
  actionPlan: string[];
  motmRelevance: string;
  extraSections: MicroToolSection[];
};

const SYSTEM_PROMPT = `You are a senior B2B/manufacturing sales & marketing growth consultant at MOTM.
You are writing a short, punchy interpretation of a lead's self-reported worksheet/diagnostic/calculator
results for a quick lead-magnet report — not the full in-depth assessment. Ground every claim in the
provided inputs and computed outputs; never invent facts or numbers. Keep "whatThisMeans" to 2-4
sentences. Keep "actionPlan" to 3-5 concrete, specific next steps for the next 30 days. Keep
"motmRelevance" to 1-2 honest sentences on when MOTM's outsourced B2B sales/marketing execution
service would help and when it wouldn't — end with a soft next step, never a hard sales pitch. For any
other requested fields, follow their own instructions precisely.`;

export async function generateMicroToolSummary(input: {
  toolName: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  extraSections?: AiSectionSpec[];
  currency?: CurrencyCode;
}): Promise<MicroToolAiSummary> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured. Set it in .env to enable AI report generation.");
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const currency = input.currency ?? "INR";
  const currencySymbol = CURRENCY_SYMBOLS[currency];
  const currencyInstruction = `\n\nAll monetary amounts in the inputs/outputs are in ${currency} — always write them using the "${currencySymbol}" symbol (e.g. "${currencySymbol}50,000"), never $ or any other currency symbol unless the currency is explicitly USD.`;

  const extraSections = input.extraSections ?? [];
  const shape: Record<string, z.ZodTypeAny> = {
    whatThisMeans: z.string(),
    actionPlan: z.array(z.string()),
    motmRelevance: z.string(),
  };
  for (const section of extraSections) {
    shape[section.key] =
      section.kind === "list"
        ? z.array(z.string()).describe(section.label)
        : z.string().describe(section.label);
  }
  const schema = z.object(shape);

  const completion = await openai.chat.completions.parse({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT + currencyInstruction },
      {
        role: "user",
        content: `Tool: ${input.toolName}\n\nInputs:\n${JSON.stringify(input.inputs, null, 2)}\n\nComputed outputs:\n${JSON.stringify(
          input.outputs,
          null,
          2
        )}`,
      },
    ],
    response_format: zodResponseFormat(schema, "microtool_summary"),
  });

  const parsed = completion.choices[0]?.message.parsed as Record<string, unknown> | undefined;
  if (!parsed) throw new Error("AI summary generation returned no parsed content");

  const { whatThisMeans, actionPlan, motmRelevance, ...rest } = parsed;

  return {
    whatThisMeans: whatThisMeans as string,
    actionPlan: actionPlan as string[],
    motmRelevance: motmRelevance as string,
    extraSections: extraSections.map((s) => ({ label: s.label, body: rest[s.key] as string | string[] })),
  };
}
