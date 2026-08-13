"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/wizard/field";
import { WizardNav } from "@/components/wizard/wizard-nav";
import { saveStep } from "@/app/actions/assessment";
import { isNextRedirectError } from "@/lib/utils";
import {
  salesFunnelSchema,
  LEAD_SOURCES,
  type SalesFunnelInput,
  type SalesFunnelFormValues,
} from "@/lib/validation/assessment";

export function Step4SalesFunnelForm({
  assessmentId,
  defaultValues,
}: {
  assessmentId: string;
  defaultValues?: Partial<SalesFunnelInput>;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SalesFunnelFormValues, unknown, SalesFunnelInput>({
    resolver: zodResolver(salesFunnelSchema),
    defaultValues: {
      monthlyLeads: 0,
      qualifiedLeads: 0,
      meetings: 0,
      rfqs: 0,
      proposals: 0,
      orders: 0,
      revenue: 0,
      salesCycleDays: 30,
      leadSources: [],
      followUpProcess: "",
      monthlySpend: undefined,
      ...defaultValues,
    },
  });

  const onSubmit = async (data: SalesFunnelInput) => {
    setServerError(null);
    try {
      await saveStep(assessmentId, 4, data);
      router.push(`/assessment/${assessmentId}/step/5`);
    } catch (err) {
      if (isNextRedirectError(err)) throw err;
      setServerError("Couldn't save this step. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Monthly Leads" error={errors.monthlyLeads?.message}>
          <Input {...register("monthlyLeads")} type="number" min={0} />
        </Field>
        <Field label="Qualified Leads / mo" error={errors.qualifiedLeads?.message}>
          <Input {...register("qualifiedLeads")} type="number" min={0} />
        </Field>
        <Field label="Meetings / mo" error={errors.meetings?.message}>
          <Input {...register("meetings")} type="number" min={0} />
        </Field>
        <Field label="RFQs / mo" error={errors.rfqs?.message}>
          <Input {...register("rfqs")} type="number" min={0} />
        </Field>
        <Field label="Proposals / mo" error={errors.proposals?.message}>
          <Input {...register("proposals")} type="number" min={0} />
        </Field>
        <Field label="Orders Won / mo" error={errors.orders?.message}>
          <Input {...register("orders")} type="number" min={0} />
        </Field>
        <Field label="Monthly Revenue" error={errors.revenue?.message}>
          <Input {...register("revenue")} type="number" min={0} step="0.01" />
        </Field>
        <Field label="Avg. Sales Cycle (days)" error={errors.salesCycleDays?.message}>
          <Input {...register("salesCycleDays")} type="number" min={1} />
        </Field>
        <Field
          label="Monthly Sales/Marketing Spend (optional)"
          error={errors.monthlySpend?.message}
          hint="Enables CAC & ROI calculations"
        >
          <Input {...register("monthlySpend")} type="number" min={0} step="0.01" />
        </Field>
      </div>

      <Controller
        control={control}
        name="leadSources"
        render={({ field }) => (
          <Field label="Lead Sources" error={errors.leadSources?.message as string | undefined}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {LEAD_SOURCES.map((source) => {
                const checked = field.value?.includes(source);
                return (
                  <label key={source} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(isChecked) => {
                        const next = new Set(field.value ?? []);
                        if (isChecked) next.add(source);
                        else next.delete(source);
                        field.onChange(Array.from(next));
                      }}
                    />
                    {source}
                  </label>
                );
              })}
            </div>
          </Field>
        )}
      />

      <Field label="Follow-Up Process (optional)" error={errors.followUpProcess?.message}>
        <Textarea
          {...register("followUpProcess")}
          placeholder="How do you follow up with leads today?"
        />
      </Field>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <WizardNav backHref={`/assessment/${assessmentId}/step/3`} isSubmitting={isSubmitting} />
    </form>
  );
}
