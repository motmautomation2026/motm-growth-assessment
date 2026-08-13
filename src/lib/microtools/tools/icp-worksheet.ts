import type { MicroToolDefinition } from "../types";

export const icpWorksheet: MicroToolDefinition = {
  slug: "icp-definition-worksheet",
  category: "WORKSHEET",
  name: "ICP Definition Worksheet",
  ctaLabel: "Define Your Ideal Customer Profile",
  tagline: "Find your Primary ICP, Secondary ICP, and who to stop chasing.",
  description:
    "Answer a few questions about what you sell and who buys it — we'll map your primary ICP, secondary ICP, poor-fit customer type, buyer personas, and where to focus outreach.",
  fields: [
    { type: "textarea", name: "whatYouSell", label: "What do you sell?", placeholder: "Describe your core product/service" },
    { type: "textarea", name: "whoBuysIt", label: "Who buys it?", placeholder: "Roles, departments, company types" },
    { type: "text", name: "industries", label: "Which industries use it?", placeholder: "e.g. Automotive, Aerospace" },
    { type: "text", name: "avgDealSize", label: "Average deal size?", placeholder: "e.g. 50,000 - 150,000" },
    {
      type: "select",
      name: "repeatCustomerType",
      label: "Repeat customer type?",
      options: ["One-time purchase", "Occasional repeat", "Regular repeat / contract"],
    },
    { type: "text", name: "geography", label: "Geography?", placeholder: "e.g. North America, EU, Pan-India" },
    { type: "textarea", name: "problemSolved", label: "Problem solved?", placeholder: "The core problem your best customers hire you to solve" },
  ],
  compute: () => ({}),
  aiSections: [
    { key: "primaryIcp", label: "Primary ICP", kind: "paragraph" },
    { key: "secondaryIcp", label: "Secondary ICP", kind: "paragraph" },
    { key: "poorFitIcp", label: "Poor-Fit Customer Type", kind: "paragraph" },
    { key: "buyerPersonas", label: "Buyer Personas", kind: "list" },
    { key: "outreachFocus", label: "Ideal Outreach Focus", kind: "list" },
  ],
};
