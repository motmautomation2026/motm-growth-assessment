"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/wizard/field";
import { WizardNav } from "@/components/wizard/wizard-nav";
import { saveStep } from "@/app/actions/assessment";
import { isNextRedirectError } from "@/lib/utils";
import { icpSchema, type IcpInput } from "@/lib/validation/assessment";

export function Step2IcpForm({
  assessmentId,
  defaultValues,
}: {
  assessmentId: string;
  defaultValues?: Partial<IcpInput>;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IcpInput>({
    resolver: zodResolver(icpSchema),
    defaultValues: {
      whatYouSell: "",
      whoBuysIt: "",
      targetIndustries: "",
      idealDealSize: "",
      buyingFrequency: "",
      problemSolved: "",
      customerSize: "",
      idealGeography: "",
      primaryCompetitors: "",
      existingCustomers: "",
      ...defaultValues,
    },
  });

  const onSubmit = async (data: IcpInput) => {
    setServerError(null);
    try {
      await saveStep(assessmentId, 2, data);
      router.push(`/assessment/${assessmentId}/step/3`);
    } catch (err) {
      if (isNextRedirectError(err)) throw err;
      setServerError("Couldn't save this step. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="What do you sell?" error={errors.whatYouSell?.message} className="sm:col-span-2">
          <Textarea {...register("whatYouSell")} placeholder="Describe your core product/service offering" />
        </Field>
        <Field label="Who buys it?" error={errors.whoBuysIt?.message} className="sm:col-span-2">
          <Textarea {...register("whoBuysIt")} placeholder="Roles, departments, or company types that buy from you" />
        </Field>
        <Field label="Which industries?" error={errors.targetIndustries?.message}>
          <Input {...register("targetIndustries")} placeholder="e.g. Automotive, Aerospace" />
        </Field>
        <Field label="Ideal customer's average deal size?" error={errors.idealDealSize?.message}>
          <Input {...register("idealDealSize")} placeholder="e.g. 50,000 - 150,000" />
        </Field>
        <Field label="Buying frequency?" error={errors.buyingFrequency?.message}>
          <Input {...register("buyingFrequency")} placeholder="e.g. Once, annually, recurring" />
        </Field>
        <Field label="Ideal customer size?" error={errors.customerSize?.message}>
          <Input {...register("customerSize")} placeholder="e.g. 100-500 employees" />
        </Field>
        <Field label="Ideal geography?" error={errors.idealGeography?.message}>
          <Input {...register("idealGeography")} placeholder="e.g. North America, EU" />
        </Field>
        <Field label="Primary competitors (optional)" error={errors.primaryCompetitors?.message}>
          <Input {...register("primaryCompetitors")} placeholder="Who do you lose deals to?" />
        </Field>
        <Field label="What problem do you solve?" error={errors.problemSolved?.message} className="sm:col-span-2">
          <Textarea {...register("problemSolved")} placeholder="The core problem your best customers hire you to solve" />
        </Field>
        <Field
          label="Describe your best existing customers (optional)"
          error={errors.existingCustomers?.message}
          className="sm:col-span-2"
        >
          <Textarea {...register("existingCustomers")} placeholder="Your best-fit accounts today" />
        </Field>
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <WizardNav isSubmitting={isSubmitting} />
    </form>
  );
}
