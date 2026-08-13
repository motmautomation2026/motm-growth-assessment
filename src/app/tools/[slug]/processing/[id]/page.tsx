import { notFound, redirect } from "next/navigation";
import { ensureMicroToolAiSummary, getMicroToolSubmission } from "@/app/actions/microtools";

export default async function ToolProcessingPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;

  const submission = await getMicroToolSubmission(id);
  if (!submission || submission.toolSlug !== slug) notFound();

  await ensureMicroToolAiSummary(id);

  redirect(`/tools/${slug}/result/${id}`);
}
