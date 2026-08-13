import { z } from "zod";
import { CURRENCIES } from "@/lib/currency";
import type { FieldConfig } from "./types";

export const leadCaptureSchema = z.object({
  contactName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid work email"),
  companyName: z.string().min(2, "Company name is required"),
  currency: z.enum(CURRENCIES),
});
export type LeadCaptureInput = z.infer<typeof leadCaptureSchema>;

function buildFieldSchema(field: FieldConfig): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case "text":
      schema = field.optional ? z.string() : z.string().min(2, `${field.label} is required`);
      break;
    case "textarea":
      schema = field.optional ? z.string() : z.string().min(5, `${field.label} is required`);
      break;
    case "number":
      schema = z.coerce.number().min(field.min ?? 0);
      break;
    case "select":
      schema = z.enum(field.options as [string, ...string[]]);
      break;
    case "multiselect":
      schema = field.optional
        ? z.array(z.enum(field.options as [string, ...string[]]))
        : z.array(z.enum(field.options as [string, ...string[]])).min(1, "Select at least one option");
      break;
  }

  return field.optional ? schema.optional() : schema;
}

export function buildFormSchema(fields: FieldConfig[], needsCurrency = false) {
  const shape: Record<string, z.ZodTypeAny> = {
    contactName: leadCaptureSchema.shape.contactName,
    email: leadCaptureSchema.shape.email,
    companyName: leadCaptureSchema.shape.companyName,
  };
  if (needsCurrency) shape.currency = leadCaptureSchema.shape.currency;
  for (const field of fields) shape[field.name] = buildFieldSchema(field);
  return z.object(shape);
}

export function buildDefaultValues(fields: FieldConfig[], needsCurrency = false): Record<string, unknown> {
  const defaults: Record<string, unknown> = { contactName: "", email: "", companyName: "" };
  if (needsCurrency) defaults.currency = "INR";
  for (const field of fields) {
    defaults[field.name] = field.type === "multiselect" ? [] : field.type === "number" ? 0 : "";
  }
  return defaults;
}
