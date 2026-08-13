"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/wizard/field";
import { WizardNav } from "@/components/wizard/wizard-nav";
import { saveStep } from "@/app/actions/assessment";
import { isNextRedirectError } from "@/lib/utils";
import { marketingSchema, type MarketingInput } from "@/lib/validation/assessment";

const CHANNELS: { key: keyof MarketingInput; label: string }[] = [
  { key: "website", label: "Website" },
  { key: "seo", label: "SEO / Organic Search" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "coldEmail", label: "Cold Email" },
  { key: "emailMarketing", label: "Email Marketing / Nurture" },
  { key: "tradeShows", label: "Trade Shows" },
  { key: "content", label: "Content Marketing" },
  { key: "analytics", label: "Analytics / Tracking" },
  { key: "crm", label: "CRM" },
  { key: "automation", label: "Marketing Automation" },
];

const LEVEL_OPTIONS = [
  { value: "NONE", label: "Not doing this" },
  { value: "PARTIAL", label: "Doing it, inconsistently" },
  { value: "FULL", label: "Fully in place" },
] as const;

export function Step5MarketingForm({
  assessmentId,
  defaultValues,
}: {
  assessmentId: string;
  defaultValues?: Partial<MarketingInput>;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MarketingInput>({
    resolver: zodResolver(marketingSchema),
    defaultValues: {
      seo: "NONE",
      linkedin: "NONE",
      coldEmail: "NONE",
      emailMarketing: "NONE",
      tradeShows: "NONE",
      crm: "NONE",
      automation: "NONE",
      website: "NONE",
      analytics: "NONE",
      content: "NONE",
      ...defaultValues,
    },
  });

  const onSubmit = async (data: MarketingInput) => {
    setServerError(null);
    try {
      await saveStep(assessmentId, 5, data);
      router.push(`/assessment/${assessmentId}/step/6`);
    } catch (err) {
      if (isNextRedirectError(err)) throw err;
      setServerError("Couldn't save this step. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {CHANNELS.map(({ key, label }) => (
          <Controller
            key={key}
            control={control}
            name={key}
            render={({ field }) => (
              <Field label={label} error={errors[key]?.message}>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVEL_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        ))}
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <WizardNav backHref={`/assessment/${assessmentId}/step/4`} isSubmitting={isSubmitting} />
    </form>
  );
}
