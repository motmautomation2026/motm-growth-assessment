import Link from "next/link";
import { ClipboardList, Sparkles, FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeroFade } from "@/components/marketing/hero-fade";
import { Logo } from "@/components/brand/logo";
import { getResumableAssessmentId, getAssessmentWithResponses } from "@/app/actions/assessment";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Take the Assessment",
    description:
      "Answer guided questions about your ICP, funnel, decision makers, and marketing — under 10 minutes.",
  },
  {
    icon: Sparkles,
    title: "AI Analysis",
    description:
      "We score your ICP fit, sales funnel health, and marketing maturity, then interpret the results with AI.",
  },
  {
    icon: FileText,
    title: "Get Your Report",
    description:
      "See your scores on a live dashboard and download a personalized growth report as a PDF.",
  },
];

const TRUST_POINTS = [
  "Built for manufacturing & B2B companies",
  "Takes under 10 minutes",
  "100% free, no credit card",
];

export default async function LandingPage() {
  const resumableId = await getResumableAssessmentId();
  const resumable = resumableId ? await getAssessmentWithResponses(resumableId) : null;
  const canResume =
    resumable && (resumable.status === "IN_PROGRESS" || resumable.status === "DRAFT");

  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 font-heading text-base font-semibold tracking-tight">
          <Logo size={88} />
        </div>
        <div className="flex items-center gap-4">
          <Link href="/tools" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Free Tools
          </Link>
          <Button nativeButton={false} render={<Link href="/assessment/start" />} size="sm">
            Start Assessment
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <HeroFade>
          <section className="mx-auto max-w-4xl px-6 pt-16 pb-20 text-center sm:pt-24">
            {canResume ? (
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm">
                You have an assessment in progress.{" "}
                <Link
                  href={`/assessment/${resumableId}/step/${resumable!.currentStep || 2}`}
                  className="font-medium text-primary underline"
                >
                  Continue
                </Link>
              </div>
            ) : null}

            <h1 className="text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Discover Your Sales Funnel Health, ICP Readiness &amp; Growth Opportunities
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-muted-foreground">
              A free AI-powered growth assessment built for manufacturing and B2B companies —
              in under 10 minutes.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" nativeButton={false} render={<Link href="/assessment/start" />}>
                Start Your Free Assessment <ArrowRight />
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {TRUST_POINTS.map((point) => (
                <span key={point} className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-primary" />
                  {point}
                </span>
              ))}
            </div>
          </section>
        </HeroFade>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <Card key={step.title}>
                <CardContent className="space-y-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[linear-gradient(to_bottom_right,var(--primary-glow),var(--primary))] text-primary-foreground">
                    <step.icon className="size-5" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">Step {i + 1}</p>
                  <h3 className="font-heading text-xl font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} MOTM. All rights reserved.</span>
          <Link href="/assessment/start" className="text-primary hover:underline">
            Start your assessment →
          </Link>
        </div>
      </footer>
    </div>
  );
}
