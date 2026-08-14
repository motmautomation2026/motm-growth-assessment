import { z } from "zod";
import { CURRENCIES } from "@/lib/currency";

export const CHANNEL_LEVELS = ["NONE", "PARTIAL", "FULL"] as const;

export const contactSchema = z.object({
  contactName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid work email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  jobTitle: z.string().optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const INDUSTRIES = [
  "Industrial Machinery & Equipment",
  "Metal Fabrication",
  "Plastics & Packaging",
  "Automotive & Transportation",
  "Electronics & Electrical",
  "Chemicals & Materials",
  "Construction & Building Products",
  "Aerospace & Defense",
  "Food & Beverage Processing",
  "Industrial Services",
  "Other B2B Manufacturing",
] as const;

export const EMPLOYEE_RANGES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"] as const;

// Deliberately currency-neutral (no symbol) — the actual currency comes from
// the separate `currency` field, this is just a size bucket.
export const REVENUE_RANGES = [
  "Under 1M",
  "1M - 5M",
  "5M - 10M",
  "10M - 50M",
  "50M - 100M",
  "100M+",
] as const;

export const companyInfoSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  // Users routinely type bare domains ("www.motm.tech") without a protocol —
  // z.url() rejects those outright, so normalize by prepending https:// first.
  website: z.preprocess((val) => {
    if (typeof val !== "string") return val;
    const trimmed = val.trim();
    if (trimmed === "") return "";
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }, z.string().url("Enter a valid website (e.g. www.example.com)").optional().or(z.literal(""))),
  industry: z.string().min(1, "Select an industry"),
  products: z.string().optional(),
  services: z.string().optional(),
  countries: z.preprocess(
    (val) =>
      typeof val === "string"
        ? val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : val,
    z.array(z.string()).min(1, "Enter at least one country/region")
  ),
  employees: z.string().min(1, "Select company size"),
  revenueRange: z.string().min(1, "Select revenue range"),
  targetMarket: z.string().optional(),
  currency: z.enum(CURRENCIES),
  avgDealSize: z.coerce.number().positive("Enter a positive number"),
});
export type CompanyInfoInput = z.infer<typeof companyInfoSchema>;

export const step1Schema = contactSchema.merge(companyInfoSchema);
export type Step1Input = z.infer<typeof step1Schema>;
export type Step1FormValues = z.input<typeof step1Schema>;

export const icpSchema = z.object({
  whatYouSell: z.string().min(5, "Please describe what you sell"),
  whoBuysIt: z.string().min(5, "Please describe your buyers"),
  targetIndustries: z.string().min(3),
  idealDealSize: z.string().min(1),
  buyingFrequency: z.string().min(1),
  problemSolved: z.string().min(5),
  customerSize: z.string().min(1),
  idealGeography: z.string().min(1),
  primaryCompetitors: z.string().optional(),
  existingCustomers: z.string().optional(),
});
export type IcpInput = z.infer<typeof icpSchema>;

export const decisionMakerSchema = z.object({
  whoApproves: z.string().min(2),
  whoInfluences: z.string().min(2),
  whoPays: z.string().min(2),
  whoEvaluatesTechnically: z.string().optional(),
  hasBuyingCommittee: z.enum(["YES", "NO", "SOMETIMES"]),
  procurementInvolved: z.enum(["YES", "NO", "SOMETIMES"]),
  ceoApprovalRequired: z.enum(["YES", "NO", "SOMETIMES"]),
  budgetOwner: z.string().min(2),
});
export type DecisionMakerInput = z.infer<typeof decisionMakerSchema>;

export const LEAD_SOURCES = [
  "Website",
  "LinkedIn",
  "Cold Email",
  "Cold Calling",
  "Referrals",
  "Trade Shows",
  "Paid Ads",
  "SEO / Organic Search",
  "Other",
] as const;

export const salesFunnelSchema = z
  .object({
    monthlyLeads: z.coerce.number().int().min(0),
    qualifiedLeads: z.coerce.number().int().min(0),
    meetings: z.coerce.number().int().min(0),
    rfqs: z.coerce.number().int().min(0),
    proposals: z.coerce.number().int().min(0),
    orders: z.coerce.number().int().min(0),
    revenue: z.coerce.number().min(0),
    salesCycleDays: z.coerce.number().int().positive(),
    leadSources: z.array(z.enum(LEAD_SOURCES)).min(1, "Select at least one lead source"),
    followUpProcess: z.string().optional(),
    monthlySpend: z.coerce.number().min(0).optional(),
  })
  .refine((v) => v.qualifiedLeads <= v.monthlyLeads, {
    message: "Qualified leads can't exceed total leads",
    path: ["qualifiedLeads"],
  })
  .refine((v) => v.meetings <= v.qualifiedLeads, {
    message: "Meetings can't exceed qualified leads",
    path: ["meetings"],
  })
  .refine((v) => v.orders <= v.proposals || v.proposals === 0, {
    message: "Orders can't exceed proposals",
    path: ["orders"],
  });
export type SalesFunnelInput = z.infer<typeof salesFunnelSchema>;
export type SalesFunnelFormValues = z.input<typeof salesFunnelSchema>;

export const marketingSchema = z.object({
  seo: z.enum(CHANNEL_LEVELS),
  linkedin: z.enum(CHANNEL_LEVELS),
  coldEmail: z.enum(CHANNEL_LEVELS),
  emailMarketing: z.enum(CHANNEL_LEVELS),
  tradeShows: z.enum(CHANNEL_LEVELS),
  crm: z.enum(CHANNEL_LEVELS),
  automation: z.enum(CHANNEL_LEVELS),
  website: z.enum(CHANNEL_LEVELS),
  analytics: z.enum(CHANNEL_LEVELS),
  content: z.enum(CHANNEL_LEVELS),
});
export type MarketingInput = z.infer<typeof marketingSchema>;

export const BUSINESS_GOALS = [
  "Increase Revenue",
  "Expand Regions",
  "Export",
  "Dealer Network",
  "OEM Customers",
  "Automation",
  "Reduce Cost",
  "Hire Sales Team",
  "Outsource Sales",
] as const;

export const businessGoalsSchema = z.object({
  goals: z.array(z.enum(BUSINESS_GOALS)).min(1, "Select at least one goal"),
});
export type BusinessGoalsInput = z.infer<typeof businessGoalsSchema>;

export const STEP_SCHEMAS = [
  step1Schema,
  icpSchema,
  decisionMakerSchema,
  salesFunnelSchema,
  marketingSchema,
  businessGoalsSchema,
] as const;

export const TOTAL_STEPS = STEP_SCHEMAS.length;
