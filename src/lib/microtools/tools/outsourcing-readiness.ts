import { scoreBand } from "@/lib/engine/scoring";
import type { MicroToolDefinition } from "../types";

const fitLabel = (score: number) =>
  score >= 70 ? "Strong Fit" : score >= 40 ? "Potential Fit — Some Gaps to Close First" : "Not Yet Ready";

export const outsourcingReadiness: MicroToolDefinition = {
  slug: "sales-outsourcing-readiness-score",
  category: "DIAGNOSTIC",
  name: "Sales Outsourcing Readiness Score",
  ctaLabel: "Check If Your Business Is Ready for Sales Outsourcing",
  tagline: "Find out if — and when — outsourced sales execution makes sense for you.",
  description: "Six questions about your product clarity, ICP, and internal readiness reveal your outsourcing-readiness score.",
  fields: [
    { type: "select", name: "productClarity", label: "Product clarity", options: ["Clear and documented", "Somewhat clear", "Not clear"] },
    { type: "select", name: "icpDefined", label: "Is your ICP defined?", options: ["Yes, clearly defined", "Roughly defined", "Not defined"] },
    { type: "select", name: "salesMaterial", label: "Sales material readiness", options: ["Ready", "Partially ready", "Not ready"] },
    { type: "select", name: "technicalSupport", label: "Technical support availability", options: ["Available", "Limited", "Not available"] },
    { type: "select", name: "weeklyReviewCommitment", label: "Can you commit to weekly reviews?", options: ["Yes", "No"] },
    {
      type: "select",
      name: "expectationMaturity",
      label: "Expectations about results",
      options: [
        "Realistic — understands it takes time",
        "Somewhat realistic",
        "Expects guaranteed instant leads",
      ],
    },
  ],
  compute: (input) => {
    // Explicit best/middle answer per field, rather than a shared hardcoded string
    // list — that pattern only worked by coincidence (no option text overlapped
    // across fields) and would silently mis-score if any option label ever changed.
    const map3 = (v: unknown, best: string, middle: string) => (v === best ? 100 : v === middle ? 50 : 0);

    const productScore = map3(input.productClarity, "Clear and documented", "Somewhat clear");
    const icpScore = map3(input.icpDefined, "Yes, clearly defined", "Roughly defined");
    const materialScore = map3(input.salesMaterial, "Ready", "Partially ready");
    const techScore = map3(input.technicalSupport, "Available", "Limited");
    const reviewScore = input.weeklyReviewCommitment === "Yes" ? 100 : 0;
    const expectationScore = map3(
      input.expectationMaturity,
      "Realistic — understands it takes time",
      "Somewhat realistic"
    );

    const score = Math.round(
      (productScore + icpScore + materialScore + techScore + reviewScore + expectationScore) / 6
    );

    return {
      headline: { label: "Sales Outsourcing Readiness Score", score, band: scoreBand(score) },
      sections: [{ label: "MOTM-Fit Indication", body: fitLabel(score) }],
    };
  },
};
