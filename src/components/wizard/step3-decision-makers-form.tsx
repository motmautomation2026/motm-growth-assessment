"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field } from "@/components/wizard/field";
import { WizardNav } from "@/components/wizard/wizard-nav";
import { saveStep } from "@/app/actions/assessment";
import { isNextRedirectError } from "@/lib/utils";
import { decisionMakerSchema, type DecisionMakerInput } from "@/lib/validation/assessment";

const YES_NO_SOMETIMES = [
  { value: "YES", label: "Yes" },
  { value: "NO", label: "No" },
  { value: "SOMETIMES", label: "Sometimes" },
] as const;

function YesNoField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <Field label={label} error={error}>
      <RadioGroup value={value} onValueChange={onChange} className="flex flex-row gap-4">
        {YES_NO_SOMETIMES.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 text-sm">
            <RadioGroupItem value={opt.value} />
            {opt.label}
          </label>
        ))}
      </RadioGroup>
    </Field>
  );
}

export function Step3DecisionMakersForm({
  assessmentId,
  defaultValues,
}: {
  assessmentId: string;
  defaultValues?: Partial<DecisionMakerInput>;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DecisionMakerInput>({
    resolver: zodResolver(decisionMakerSchema),
    defaultValues: {
      whoApproves: "",
      whoInfluences: "",
      whoPays: "",
      whoEvaluatesTechnically: "",
      hasBuyingCommittee: "SOMETIMES",
      procurementInvolved: "SOMETIMES",
      ceoApprovalRequired: "SOMETIMES",
      budgetOwner: "",
      ...defaultValues,
    },
  });

  const onSubmit = async (data: DecisionMakerInput) => {
    setServerError(null);
    try {
      await saveStep(assessmentId, 3, data);
      router.push(`/assessment/${assessmentId}/step/4`);
    } catch (err) {
      if (isNextRedirectError(err)) throw err;
      setServerError("Couldn't save this step. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Who approves the purchase?" error={errors.whoApproves?.message}>
          <Input {...register("whoApproves")} placeholder="e.g. Plant Manager" />
        </Field>
        <Field label="Who influences the decision?" error={errors.whoInfluences?.message}>
          <Input {...register("whoInfluences")} placeholder="e.g. Engineering team" />
        </Field>
        <Field label="Who pays / controls budget?" error={errors.whoPays?.message}>
          <Input {...register("whoPays")} placeholder="e.g. CFO, Procurement" />
        </Field>
        <Field label="Who owns the budget line?" error={errors.budgetOwner?.message}>
          <Input {...register("budgetOwner")} placeholder="e.g. VP Operations" />
        </Field>
        <Field
          label="Who evaluates technically? (optional)"
          error={errors.whoEvaluatesTechnically?.message}
          className="sm:col-span-2"
        >
          <Input {...register("whoEvaluatesTechnically")} placeholder="e.g. Quality/Engineering team" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Controller
          control={control}
          name="hasBuyingCommittee"
          render={({ field }) => (
            <YesNoField
              label="Is there a buying committee?"
              value={field.value}
              onChange={field.onChange}
              error={errors.hasBuyingCommittee?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="procurementInvolved"
          render={({ field }) => (
            <YesNoField
              label="Is procurement involved?"
              value={field.value}
              onChange={field.onChange}
              error={errors.procurementInvolved?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="ceoApprovalRequired"
          render={({ field }) => (
            <YesNoField
              label="Is CEO/owner approval required?"
              value={field.value}
              onChange={field.onChange}
              error={errors.ceoApprovalRequired?.message}
            />
          )}
        />
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <WizardNav backHref={`/assessment/${assessmentId}/step/2`} isSubmitting={isSubmitting} />
    </form>
  );
}
