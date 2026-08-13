import type { ScoreBand } from "@/lib/engine/scoring";

export type FieldConfig =
  | { type: "text"; name: string; label: string; placeholder?: string; optional?: boolean; hint?: string }
  | { type: "textarea"; name: string; label: string; placeholder?: string; optional?: boolean; hint?: string }
  | {
      type: "number";
      name: string;
      label: string;
      placeholder?: string;
      optional?: boolean;
      min?: number;
      hint?: string;
    }
  | {
      type: "select";
      name: string;
      label: string;
      options: readonly string[];
      optional?: boolean;
      hint?: string;
    }
  | {
      type: "multiselect";
      name: string;
      label: string;
      options: readonly string[];
      optional?: boolean;
      hint?: string;
    };

export type MicroToolCategoryValue = "WORKSHEET" | "DIAGNOSTIC" | "CALCULATOR";

export type MicroToolMetric =
  | { label: string; value: string }
  | { label: string; value: number; format: "currency" };
export type MicroToolSection = { label: string; body: string | string[] };

export type MicroToolOutput = {
  headline?: { label: string; score: number; band: ScoreBand };
  metrics?: MicroToolMetric[];
  sections?: MicroToolSection[];
};

export type AiSectionSpec = { key: string; label: string; kind: "paragraph" | "list" };

export type MicroToolDefinition = {
  slug: string;
  category: MicroToolCategoryValue;
  name: string;
  ctaLabel: string;
  tagline: string;
  description: string;
  fields: FieldConfig[];
  compute: (input: Record<string, unknown>) => MicroToolOutput;
  /** Extra AI-generated narrative sections beyond the universal What-This-Means/Action-Plan/MOTM-Relevance trio (e.g. worksheets need named outputs like "Primary ICP"). */
  aiSections?: AiSectionSpec[];
  /** Whether this tool's inputs/outputs involve money amounts and needs a currency selector. */
  needsCurrency?: boolean;
};
