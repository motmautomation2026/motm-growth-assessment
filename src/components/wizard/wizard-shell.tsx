import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Progress } from "@/components/ui/progress";
import { StepTransition } from "@/components/wizard/step-transition";
import { TOTAL_STEPS } from "@/lib/validation/assessment";

export const STEP_TITLES = [
  "Company Information",
  "ICP Worksheet",
  "Decision Maker Mapping",
  "Sales Funnel Mapping",
  "Lead Generation & Marketing",
  "Business Goals",
];

export function WizardShell({
  step,
  description,
  children,
}: {
  step: number;
  description?: string;
  children: React.ReactNode;
}) {
  const progressValue = (step / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-base font-semibold tracking-tight"
        >
          <Logo size={88} />
        </Link>
        <span className="text-sm font-medium text-muted-foreground">
          Step {step} of {TOTAL_STEPS}
        </span>
      </header>

      <div className="mx-auto max-w-3xl px-6">
        <Progress value={progressValue} />
      </div>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <StepTransition stepKey={step}>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-balance">
            {STEP_TITLES[step - 1]}
          </h1>
          {description ? (
            <p className="mt-1.5 max-w-xl text-muted-foreground">{description}</p>
          ) : null}
          <div className="mt-8">{children}</div>
        </StepTransition>
      </main>
    </div>
  );
}
