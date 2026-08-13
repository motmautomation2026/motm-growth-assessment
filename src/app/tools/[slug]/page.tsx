import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/microtools/registry";
import { submitMicroTool } from "@/app/actions/microtools";
import { ToolShell } from "@/components/microtools/tool-shell";
import { ToolForm } from "@/components/microtools/tool-form";

export default async function ToolIntakePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  async function handleSubmit(data: Record<string, unknown>) {
    "use server";
    await submitMicroTool(slug, data);
  }

  return (
    <ToolShell title={tool.name} tagline={tool.description}>
      <ToolForm
        fields={tool.fields}
        submitLabel={tool.ctaLabel}
        onSubmitAction={handleSubmit}
        needsCurrency={tool.needsCurrency}
      />
    </ToolShell>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  return { title: tool ? `${tool.name} — MOTM` : "MOTM Tools" };
}
