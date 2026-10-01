import Link from "next/link";
import { ArrowRight, FileText, ChevronRight } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { PDF_GUIDES } from "@/lib/microtools/pdf-guides";

export const metadata = { title: "Free B2B Growth Guides — MOTM" };

export default function GuidesIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="https://www.motm.tech/" className="flex items-center gap-2 font-heading text-base font-semibold tracking-tight">
          <Logo size={88} />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground">
            All Tools
          </Link>
          <Button nativeButton={false} render={<Link href="/assessment/start" />} size="sm">
            Get Your Full Growth Assessment
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24">
        <div className="py-10">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {PDF_GUIDES.length} Free Guides to <span className="text-primary">Drive B2B Growth</span>
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            In-depth, actionable playbooks covering lead generation, conversion, sales pipeline, marketing,
            and more — built for manufacturing & B2B teams. Free to download, just tell us who you are.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PDF_GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group flex items-start gap-3 rounded-2xl border border-border bg-secondary/25 p-5 transition-colors hover:bg-secondary/50"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(to_bottom_right,var(--primary-glow),var(--primary))] text-primary-foreground">
                <FileText className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-balance">{g.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">Free PDF guide · Instant access</p>
              </div>
              <ChevronRight className="mt-2 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/40 px-6 py-5 sm:flex-row">
          <div>
            <p className="font-medium">Want the full picture, not just one guide?</p>
            <p className="text-sm text-muted-foreground">
              Get a personalized AI-generated growth report built from your own numbers.
            </p>
          </div>
          <Button nativeButton={false} render={<Link href="/assessment/start" />}>
            Get Your Full Growth Assessment <ArrowRight />
          </Button>
        </div>
      </main>
    </div>
  );
}
