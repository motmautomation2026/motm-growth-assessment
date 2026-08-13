"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/wizard/field";
import { WizardNav } from "@/components/wizard/wizard-nav";
import { startAssessment } from "@/app/actions/assessment";
import { isNextRedirectError } from "@/lib/utils";
import {
  step1Schema,
  EMPLOYEE_RANGES,
  REVENUE_RANGES,
  INDUSTRIES,
  type Step1FormValues,
  type Step1Input,
} from "@/lib/validation/assessment";
import { CURRENCIES, CURRENCY_LABELS } from "@/lib/currency";

export function Step1Form() {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step1FormValues, unknown, Step1Input>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      contactName: "",
      email: "",
      phone: "",
      jobTitle: "",
      companyName: "",
      website: "",
      industry: "",
      products: "",
      services: "",
      countries: "",
      employees: "",
      revenueRange: "",
      targetMarket: "",
      currency: "INR",
      avgDealSize: undefined,
    },
  });

  const onSubmit = async (data: Step1Input) => {
    setServerError(null);
    try {
      await startAssessment(data);
    } catch (err) {
      if (isNextRedirectError(err)) throw err;
      setServerError("Something went wrong saving your details. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Your Details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" error={errors.contactName?.message}>
            <Input {...register("contactName")} placeholder="Jane Smith" />
          </Field>
          <Field label="Work Email" error={errors.email?.message}>
            <Input {...register("email")} type="email" placeholder="jane@company.com" />
          </Field>
          <Field label="Phone (optional)" error={errors.phone?.message as string | undefined}>
            <Input {...register("phone")} placeholder="+1 555 123 4567" />
          </Field>
          <Field label="Job Title (optional)" error={errors.jobTitle?.message as string | undefined}>
            <Input {...register("jobTitle")} placeholder="VP of Sales" />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Company Information
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company Name" error={errors.companyName?.message}>
            <Input {...register("companyName")} placeholder="Acme Manufacturing Inc." />
          </Field>
          <Field label="Website" error={errors.website?.message as string | undefined}>
            <Input {...register("website")} placeholder="https://acme.com" />
          </Field>

          <Field label="Industry" error={errors.industry?.message}>
            <Controller
              control={control}
              name="industry"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field label="Employees" error={errors.employees?.message}>
            <Controller
              control={control}
              name="employees"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYEE_RANGES.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e} employees
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field label="Annual Revenue" error={errors.revenueRange?.message}>
            <Controller
              control={control}
              name="revenueRange"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Revenue range" />
                  </SelectTrigger>
                  <SelectContent>
                    {REVENUE_RANGES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field label="Currency" error={errors.currency?.message as string | undefined}>
            <Controller
              control={control}
              name="currency"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {CURRENCY_LABELS[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field
            label="Average Deal Size"
            error={errors.avgDealSize?.message}
            hint="Typical order/contract value, in the currency selected above"
          >
            <Input
              {...register("avgDealSize")}
              type="number"
              min={0}
              step="0.01"
              placeholder="25000"
            />
          </Field>

          <Field
            label="Countries / Regions You Sell To"
            error={errors.countries?.message as string | undefined}
            hint="Comma-separated, e.g. USA, Canada, Mexico"
            className="sm:col-span-2"
          >
            <Input {...register("countries")} placeholder="USA, Canada, Mexico" />
          </Field>

          <Field
            label="Products (optional)"
            error={errors.products?.message}
            className="sm:col-span-2"
          >
            <Textarea {...register("products")} placeholder="What products do you manufacture or sell?" />
          </Field>

          <Field
            label="Services (optional)"
            error={errors.services?.message}
            className="sm:col-span-2"
          >
            <Textarea {...register("services")} placeholder="What services do you offer?" />
          </Field>

          <Field
            label="Target Market (optional)"
            error={errors.targetMarket?.message}
            className="sm:col-span-2"
          >
            <Input {...register("targetMarket")} placeholder="e.g. Mid-market industrial distributors in North America" />
          </Field>
        </div>
      </section>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <WizardNav isSubmitting={isSubmitting} submitLabel="Start Assessment" />
    </form>
  );
}
