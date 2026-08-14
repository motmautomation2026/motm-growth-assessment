"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/wizard/field";
import { guideLeadSchema, type GuideLeadInput } from "@/lib/validation/guide";
import { isNextRedirectError } from "@/lib/utils";

export function GuideLeadForm({
  onSubmitAction,
}: {
  onSubmitAction: (data: GuideLeadInput) => Promise<void>;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GuideLeadInput>({
    resolver: zodResolver(guideLeadSchema),
    defaultValues: { contactName: "", email: "", companyName: "", phone: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    try {
      await onSubmitAction(data);
    } catch (err) {
      if (isNextRedirectError(err)) throw err;
      setServerError("Something went wrong. Please try again.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" error={errors.contactName?.message}>
          <Input {...register("contactName")} placeholder="Rohan Sharma" />
        </Field>
        <Field label="Work Email" error={errors.email?.message}>
          <Input {...register("email")} type="email" placeholder="rohan@company.com" />
        </Field>
        <Field label="Company Name" error={errors.companyName?.message}>
          <Input {...register("companyName")} placeholder="Acme Manufacturing Inc." />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <Input {...register("phone")} placeholder="+91 98765 43210" />
        </Field>
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full justify-center">
        {isSubmitting ? <Loader2 className="animate-spin" /> : <Download />}
        {isSubmitting ? "Preparing your download…" : "Get the Free Guide"}
        {!isSubmitting ? <ArrowRight /> : null}
      </Button>
    </form>
  );
}
