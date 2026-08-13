import { WizardShell } from "@/components/wizard/wizard-shell";
import { Step1Form } from "@/components/wizard/step1-form";

export const metadata = {
  title: "Start Your Growth Assessment — MOTM",
};

export default function StartAssessmentPage() {
  return (
    <WizardShell
      step={1}
      description="Tell us about your company so we can tailor the assessment."
    >
      <Step1Form />
    </WizardShell>
  );
}
