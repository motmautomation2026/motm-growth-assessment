import type { MicroToolDefinition } from "../types";

export const oemWorksheet: MicroToolDefinition = {
  slug: "oem-customer-identification-worksheet",
  category: "WORKSHEET",
  name: "OEM Customer Identification Worksheet",
  ctaLabel: "Identify OEM Customer Categories for Your Business",
  tagline: "Find which OEM categories fit your product and how to qualify them.",
  description:
    "A few questions about your product and current customers surface which OEM categories to target and how to qualify them fast.",
  fields: [
    { type: "text", name: "productType", label: "Product / service type", placeholder: "e.g. Precision machined components" },
    { type: "text", name: "applicationArea", label: "Application area", placeholder: "e.g. Hydraulic assemblies" },
    { type: "text", name: "industriesServed", label: "Industries served today", placeholder: "e.g. Automotive, Construction equipment" },
    { type: "textarea", name: "currentCustomers", label: "Current customers (optional)", placeholder: "Your best-fit accounts today", optional: true },
    { type: "text", name: "geography", label: "Geography", placeholder: "e.g. North America" },
    { type: "text", name: "orderValue", label: "Typical order value", placeholder: "e.g. 20,000" },
    {
      type: "select",
      name: "repeatOrderPossibility",
      label: "Repeat order possibility",
      options: ["Low", "Medium", "High"],
    },
  ],
  compute: () => ({}),
  aiSections: [
    { key: "possibleOemCategories", label: "Possible OEM Categories", kind: "list" },
    { key: "buyerDepartments", label: "Buyer Departments to Target", kind: "list" },
    { key: "qualificationQuestions", label: "Qualification Questions", kind: "list" },
    { key: "outreachAngle", label: "Outreach Angle", kind: "paragraph" },
    { key: "followUpRequirement", label: "Follow-Up Requirement", kind: "paragraph" },
  ],
};
