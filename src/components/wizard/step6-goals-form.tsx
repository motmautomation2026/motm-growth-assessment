"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/wizard/field";
import { WizardNav } from "@/components/wizard/wizard-nav";
import { saveStep, submitAssessment } from "@/app/actions/assessment";
import { isNextRedirectError } from "@/lib/utils";
import {
  businessGoalsSchema,
  BUSINESS_GOALS,
  type BusinessGoalsInput,
} from "@/lib/validation/assessment";

export function Step6GoalsForm({
  assessmentId,
  defaultValues,
}: {
  assessmentId: string;
  defaultValues?: Partial<BusinessGoalsInput>;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessGoalsInput>({
    resolver: zodResolver(businessGoalsSchema),
    defaultValues: { goals: [], ...defaultValues },
  });

  const onSubmit = async (data: BusinessGoalsInput) => {
    setServerError(null);
    try {
      await saveStep(assessmentId, 6, data);
      await submitAssessment(assessmentId);
    } catch (err) {
      if (isNextRedirectError(err)) throw err;
      setServerError("Couldn't submit your assessment. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        control={control}
        name="goals"
        render={({ field }) => (
          <Field label="What are your top growth goals?" error={errors.goals?.message as string | undefined}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {BUSINESS_GOALS.map((goal) => {
                const checked = field.value?.includes(goal);
                return (
                  <label
                    key={goal}
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm has-[[data-checked]]:border-primary has-[[data-checked]]:bg-accent"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(isChecked) => {
                        const next = new Set(field.value ?? []);
                        if (isChecked) next.add(goal);
                        else next.delete(goal);
                        field.onChange(Array.from(next));
                      }}
                    />
                    {goal}
                  </label>
                );
              })}
            </div>
          </Field>
        )}
      />

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <WizardNav
        backHref={`/assessment/${assessmentId}/step/5`}
        isSubmitting={isSubmitting}
        submitLabel="Get My Growth Assessment"
      />
    </form>
  );
}
