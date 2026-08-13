import { notFound, redirect } from "next/navigation";
import { ensureAIReport, getAssessmentWithResponses } from "@/app/actions/assessment";

export default async function ProcessingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const assessment = await getAssessmentWithResponses(id);
  if (!assessment) notFound();

  if (assessment.status === "IN_PROGRESS" || assessment.status === "DRAFT") {
    redirect(`/assessment/${id}/step/${assessment.currentStep || 2}`);
  }

  await ensureAIReport(id);

  redirect(`/assessment/${id}/dashboard`);
}
