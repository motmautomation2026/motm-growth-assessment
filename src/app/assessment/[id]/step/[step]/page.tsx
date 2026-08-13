import { notFound, redirect } from "next/navigation";
import { WizardShell } from "@/components/wizard/wizard-shell";
import { getAssessmentWithResponses } from "@/app/actions/assessment";
import { Step2IcpForm } from "@/components/wizard/step2-icp-form";
import { Step3DecisionMakersForm } from "@/components/wizard/step3-decision-makers-form";
import { Step4SalesFunnelForm } from "@/components/wizard/step4-sales-funnel-form";
import { Step5MarketingForm } from "@/components/wizard/step5-marketing-form";
import { Step6GoalsForm } from "@/components/wizard/step6-goals-form";
import type { IcpInput, DecisionMakerInput, BusinessGoalsInput } from "@/lib/validation/assessment";

const STEP_DESCRIPTIONS: Record<number, string> = {
  2: "Define your Ideal Customer Profile so we can score fit and targeting.",
  3: "Map out who's involved in the buying decision.",
  4: "Give us your monthly funnel numbers — estimates are fine.",
  5: "Tell us which marketing channels you're using today.",
  6: "Last step — what are you trying to achieve in the next 12 months?",
};

export default async function WizardStepPage({
  params,
}: {
  params: Promise<{ id: string; step: string }>;
}) {
  const { id, step: stepParam } = await params;
  const step = Number(stepParam);

  if (!Number.isInteger(step) || step < 2 || step > 6) {
    notFound();
  }

  const assessment = await getAssessmentWithResponses(id);
  if (!assessment) notFound();

  if (assessment.status === "SCORED" || assessment.status === "REPORT_GENERATED") {
    redirect(`/assessment/${id}/dashboard`);
  }

  // Don't allow skipping ahead of the furthest completed step.
  if (step > assessment.currentStep) {
    redirect(`/assessment/${id}/step/${assessment.currentStep}`);
  }

  return (
    <WizardShell step={step} description={STEP_DESCRIPTIONS[step]}>
      {step === 2 ? (
        <Step2IcpForm
          assessmentId={id}
          defaultValues={assessment.icpResponse?.answers as IcpInput | undefined}
        />
      ) : null}
      {step === 3 ? (
        <Step3DecisionMakersForm
          assessmentId={id}
          defaultValues={assessment.decisionMakerResponse?.answers as DecisionMakerInput | undefined}
        />
      ) : null}
      {step === 4 ? (
        <Step4SalesFunnelForm
          assessmentId={id}
          defaultValues={
            assessment.salesFunnelResponse
              ? {
                  monthlyLeads: assessment.salesFunnelResponse.monthlyLeads,
                  qualifiedLeads: assessment.salesFunnelResponse.qualifiedLeads,
                  meetings: assessment.salesFunnelResponse.meetings,
                  rfqs: assessment.salesFunnelResponse.rfqs,
                  proposals: assessment.salesFunnelResponse.proposals,
                  orders: assessment.salesFunnelResponse.orders,
                  revenue: assessment.salesFunnelResponse.revenue,
                  salesCycleDays: assessment.salesFunnelResponse.salesCycleDays,
                  leadSources: assessment.salesFunnelResponse.leadSources as string[] as never,
                  followUpProcess: assessment.salesFunnelResponse.followUpProcess ?? "",
                  monthlySpend: assessment.salesFunnelResponse.monthlySpend ?? undefined,
                }
              : undefined
          }
        />
      ) : null}
      {step === 5 ? (
        <Step5MarketingForm
          assessmentId={id}
          defaultValues={assessment.marketingResponse ?? undefined}
        />
      ) : null}
      {step === 6 ? (
        <Step6GoalsForm
          assessmentId={id}
          defaultValues={
            assessment.businessGoalsResponse
              ? { goals: assessment.businessGoalsResponse.goals as BusinessGoalsInput["goals"] }
              : undefined
          }
        />
      ) : null}
    </WizardShell>
  );
}
