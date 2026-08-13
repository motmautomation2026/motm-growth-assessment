"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WizardNav({
  backHref,
  isSubmitting,
  submitLabel = "Continue",
}: {
  backHref?: string;
  isSubmitting: boolean;
  submitLabel?: string;
}) {
  const router = useRouter();

  return (
    <div className="mt-10 flex items-center justify-between border-t pt-6">
      {backHref ? (
        <Button
          type="button"
          variant="ghost"
          disabled={isSubmitting}
          onClick={() => router.push(backHref)}
        >
          <ArrowLeft /> Back
        </Button>
      ) : (
        <span />
      )}
      <Button type="submit" disabled={isSubmitting} size="lg">
        {isSubmitting ? <Loader2 className="animate-spin" /> : null}
        {submitLabel}
        {!isSubmitting ? <ArrowRight /> : null}
      </Button>
    </div>
  );
}
