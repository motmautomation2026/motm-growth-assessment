"use client";

import { useState } from "react";
import { useForm, Controller, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/wizard/field";
import { buildFormSchema, buildDefaultValues } from "@/lib/microtools/form-schema";
import type { FieldConfig } from "@/lib/microtools/types";
import { isNextRedirectError } from "@/lib/utils";
import { CURRENCIES, CURRENCY_LABELS } from "@/lib/currency";

export function ToolForm({
  fields,
  submitLabel,
  onSubmitAction,
  needsCurrency = false,
}: {
  fields: FieldConfig[];
  submitLabel: string;
  onSubmitAction: (data: Record<string, unknown>) => Promise<void>;
  needsCurrency?: boolean;
}) {
  const schema = buildFormSchema(fields, needsCurrency);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: buildDefaultValues(fields, needsCurrency),
  });

  const fieldErrors = errors as FieldErrors<Record<string, unknown>>;

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    try {
      await onSubmitAction(data as Record<string, unknown>);
    } catch (err) {
      if (isNextRedirectError(err)) throw err;
      setServerError("Something went wrong. Please try again.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Your Details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" error={fieldErrors.contactName?.message as string | undefined}>
            <Input {...register("contactName")} placeholder="Jane Smith" />
          </Field>
          <Field label="Work Email" error={fieldErrors.email?.message as string | undefined}>
            <Input {...register("email")} type="email" placeholder="jane@company.com" />
          </Field>
          <Field
            label="Company Name"
            error={fieldErrors.companyName?.message as string | undefined}
            className={needsCurrency ? undefined : "sm:col-span-2"}
          >
            <Input {...register("companyName")} placeholder="Acme Manufacturing Inc." />
          </Field>
          {needsCurrency ? (
            <Controller
              control={control}
              name="currency"
              render={({ field }) => (
                <Field label="Currency" error={fieldErrors.currency?.message as string | undefined}>
                  <Select value={field.value as string} onValueChange={field.onChange}>
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
                </Field>
              )}
            />
          ) : null}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const error = fieldErrors[field.name]?.message as string | undefined;

          if (field.type === "text" || field.type === "number") {
            return (
              <Field
                key={field.name}
                label={field.label}
                error={error}
                hint={field.hint}
                className={field.type === "text" ? "sm:col-span-2" : undefined}
              >
                <Input
                  {...register(field.name)}
                  type={field.type === "number" ? "number" : "text"}
                  placeholder={field.placeholder}
                />
              </Field>
            );
          }

          if (field.type === "textarea") {
            return (
              <Field key={field.name} label={field.label} error={error} hint={field.hint} className="sm:col-span-2">
                <Textarea {...register(field.name)} placeholder={field.placeholder} />
              </Field>
            );
          }

          if (field.type === "select") {
            return (
              <Controller
                key={field.name}
                control={control}
                name={field.name}
                render={({ field: rhf }) => (
                  <Field label={field.label} error={error} hint={field.hint}>
                    <Select value={rhf.value as string} onValueChange={rhf.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            );
          }

          return (
            <Controller
              key={field.name}
              control={control}
              name={field.name}
              render={({ field: rhf }) => {
                const value = (rhf.value as string[] | undefined) ?? [];
                return (
                  <Field label={field.label} error={error} hint={field.hint} className="sm:col-span-2">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {field.options.map((opt) => {
                        const checked = value.includes(opt);
                        return (
                          <label key={opt} className="flex items-center gap-2 text-sm">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(isChecked) => {
                                const next = new Set(value);
                                if (isChecked) next.add(opt);
                                else next.delete(opt);
                                rhf.onChange(Array.from(next));
                              }}
                            />
                            {opt}
                          </label>
                        );
                      })}
                    </div>
                  </Field>
                );
              }}
            />
          );
        })}
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <div className="flex justify-end border-t pt-6">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          {submitLabel}
          {!isSubmitting ? <ArrowRight /> : null}
        </Button>
      </div>
    </form>
  );
}
