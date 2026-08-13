import type { MicroToolDefinition } from "../types";

export const decisionMakerWorksheet: MicroToolDefinition = {
  slug: "decision-maker-mapping-worksheet",
  category: "WORKSHEET",
  name: "Decision-Maker Mapping Worksheet",
  ctaLabel: "Find the Right B2B Decision-Makers to Target",
  tagline: "Map who approves, influences, evaluates, and pays.",
  description:
    "A few questions about your buying process reveal who to target, who influences the deal, and how to message each stakeholder.",
  fields: [
    { type: "text", name: "productCategory", label: "Product / service category", placeholder: "e.g. Industrial pumps" },
    { type: "text", name: "targetCompanyType", label: "Target company type", placeholder: "e.g. Mid-size manufacturers" },
    { type: "text", name: "dealSize", label: "Typical deal size", placeholder: "e.g. 30,000" },
    { type: "select", name: "technicalComplexity", label: "Technical complexity", options: ["Low", "Medium", "High"] },
    { type: "textarea", name: "buyingProcess", label: "Describe your typical buying process", placeholder: "How does a deal usually move from first contact to close?" },
    {
      type: "select",
      name: "technicalApprovalRequired",
      label: "Is technical approval required?",
      options: ["Yes", "No", "Sometimes"],
    },
    {
      type: "select",
      name: "vendorRegistrationRequired",
      label: "Is vendor registration/procurement required?",
      options: ["Yes", "No", "Sometimes"],
    },
  ],
  compute: () => ({}),
  aiSections: [
    { key: "primaryDecisionMaker", label: "Primary Decision-Maker", kind: "paragraph" },
    { key: "influencers", label: "Influencers", kind: "list" },
    { key: "technicalEvaluator", label: "Technical Evaluator", kind: "paragraph" },
    { key: "commercialBuyer", label: "Commercial Buyer", kind: "paragraph" },
    { key: "procurementContact", label: "Procurement Contact", kind: "paragraph" },
    { key: "messageAngle", label: "Recommended Message Angle", kind: "paragraph" },
  ],
};
