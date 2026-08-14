import { z } from "zod";

export const guideLeadSchema = z.object({
  contactName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid work email"),
  companyName: z.string().min(2, "Company name is required"),
  phone: z.string().min(7, "Enter a valid phone number"),
});
export type GuideLeadInput = z.infer<typeof guideLeadSchema>;
