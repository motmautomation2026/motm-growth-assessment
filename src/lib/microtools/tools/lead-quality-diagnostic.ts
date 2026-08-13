import { scoreBand } from "@/lib/engine/scoring";
import type { MicroToolDefinition } from "../types";

const THREE_LEVEL = ["Always / Yes", "Sometimes", "Rarely / No"] as const;

const CHECKS: { key: string; label: string; reason: string }[] = [
  { key: "icpMatch", label: "Leads match your ICP", reason: "Many incoming leads don't match your Ideal Customer Profile" },
  {
    key: "decisionMakerIdentification",
    label: "You identify the decision-maker early",
    reason: "The real decision-maker isn't identified until late in the process",
  },
  { key: "budgetQualification", label: "You qualify budget early", reason: "Budget isn't qualified before time is invested" },
  {
    key: "applicationQualification",
    label: "You qualify the technical application/use-case",
    reason: "The technical fit/application isn't validated early enough",
  },
  { key: "followUpConsistency", label: "You follow up consistently", reason: "Follow-up is inconsistent, so leads go cold" },
  { key: "quotationTracking", label: "You track quotations to close", reason: "Quotations aren't tracked through to a close/loss decision" },
];

const levelScore = (v: unknown) => (v === THREE_LEVEL[0] ? 100 : v === THREE_LEVEL[1] ? 50 : 0);

export const leadQualityDiagnostic: MicroToolDefinition = {
  slug: "lead-quality-diagnostic",
  category: "DIAGNOSTIC",
  name: "Lead Quality Diagnostic",
  ctaLabel: "Diagnose Why Your Leads Are Not Converting",
  tagline: "Find the top reasons your leads aren't turning into orders.",
  description: "Six quick checks on your qualification process reveal your lead quality score and top conversion blockers.",
  fields: CHECKS.map((c) => ({
    type: "select" as const,
    name: c.key,
    label: c.label,
    options: THREE_LEVEL,
  })),
  compute: (input) => {
    const scored = CHECKS.map((c) => ({ ...c, points: levelScore(input[c.key]) }));
    const score = Math.round(scored.reduce((sum, c) => sum + c.points, 0) / scored.length);
    const topReasons = [...scored]
      .sort((a, b) => a.points - b.points)
      .slice(0, 3)
      .filter((c) => c.points < 100)
      .map((c) => c.reason);

    return {
      headline: { label: "Lead Quality Score", score, band: scoreBand(score) },
      sections: [
        {
          label: "Top Reasons Leads May Not Convert",
          body: topReasons.length ? topReasons : ["Your qualification process is solid across the board."],
        },
      ],
    };
  },
};
