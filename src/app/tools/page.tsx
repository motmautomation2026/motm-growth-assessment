import Link from "next/link";
import {
  FileText,
  ClipboardList,
  Stethoscope,
  Calculator,
  Sparkles,
  Zap,
  ShieldCheck,
  Gift,
  ArrowRight,
} from "lucide-react";
import { CategoryColumn, type CategoryItem } from "@/components/marketing/category-column";
import { ScoreRing } from "@/components/marketing/score-ring";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { MICRO_TOOLS } from "@/lib/microtools/registry";
import { PDF_GUIDES } from "@/lib/microtools/pdf-guides";

export const metadata = { title: "Free B2B Sales & Marketing Tools — MOTM" };

const worksheets = MICRO_TOOLS.filter((t) => t.category === "WORKSHEET");
const diagnostics = MICRO_TOOLS.filter((t) => t.category === "DIAGNOSTIC");
const calculators = MICRO_TOOLS.filter((t) => t.category === "CALCULATOR");

const STATS = [
  { icon: FileText, value: `${MICRO_TOOLS.length + PDF_GUIDES.length}+`, label: "Resources" },
  { icon: ShieldCheck, value: "100%", label: "Free to Use" },
  { icon: Zap, value: "Instant", label: "Results" },
  { icon: Sparkles, value: "AI", label: "Personalized Report" },
];

function PdfPreview() {
  return (
    <div className="space-y-2">
      {PDF_GUIDES.slice(0, 3).map((g) => (
        <div key={g.title} className="flex items-center gap-2 text-xs">
          <FileText className="size-3.5 shrink-0 text-primary" />
          <span className="truncate text-muted-foreground">{g.title}</span>
        </div>
      ))}
      <p className="pt-1 text-[11px] text-muted-foreground">+{PDF_GUIDES.length - 3} more guides</p>
    </div>
  );
}

function WorksheetPreview() {
  const rows = [
    { stage: "Leads", value: "120" },
    { stage: "Qualified", value: "60" },
    { stage: "Meetings", value: "30" },
  ];
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="text-muted-foreground">
          <th className="pb-1 text-left font-medium">Stage</th>
          <th className="pb-1 text-right font-medium">Your Data</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.stage} className="border-t border-border">
            <td className="py-1.5">{r.stage}</td>
            <td className="py-1.5 text-right font-medium tabular-nums">{r.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DiagnosticPreview() {
  return (
    <div>
      <ScoreRing value={72} band="GREEN" label="Good" />
      <p className="mt-2 text-[11px] text-muted-foreground">Sample: Funnel Health Score</p>
    </div>
  );
}

function CalculatorPreview() {
  const rows = [
    { label: "Monthly Leads", value: "120" },
    { label: "Close Rate", value: "15%" },
    { label: "Deal Value", value: "₹40,00,000" },
  ];
  return (
    <div className="space-y-1.5 text-xs">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between text-muted-foreground">
          <span>{r.label}</span>
          <span className="font-medium text-foreground tabular-nums">{r.value}</span>
        </div>
      ))}
      <div className="mt-2 rounded-lg bg-accent px-2.5 py-2">
        <p className="text-[10px] text-accent-foreground/80">Potential Revenue Lost</p>
        <p className="font-heading text-base font-semibold text-accent-foreground">₹1,50,00,000</p>
      </div>
    </div>
  );
}

function toItems(tools: typeof MICRO_TOOLS): CategoryItem[] {
  return tools.map((t) => ({ label: t.name, href: `/tools/${t.slug}` }));
}

export default function ToolsIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2 font-heading text-base font-semibold tracking-tight">
          <Logo size={88} />
        </Link>
        <div className="flex items-center gap-3">
          <Button nativeButton={false} render={<Link href="/assessment/start" />} size="sm">
            Get Your Full Growth Assessment
          </Button>
          <Button nativeButton={false} render={<Link href="https://www.motm.tech/" />} size="sm">
            Visit MOTM Technologies
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Resources That Drive <span className="text-primary">Real Growth</span>
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Actionable guides, interactive worksheets, diagnostics, and calculators to help you solve
              growth challenges and make better decisions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
                <s.icon className="size-4 text-primary" />
                <div>
                  <p className="text-sm font-semibold leading-none">{s.value}</p>
                  <p className="text-[11px] leading-none text-muted-foreground">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-4">
          <CategoryColumn
            icon={FileText}
            step={1}
            title="PDF Guides"
            description="In-depth guides to build your growth foundation."
            items={PDF_GUIDES.slice(0, 6).map((g) => ({ label: g.title, href: `/guides/${g.slug}` }))}
            preview={<PdfPreview />}
            ctaLabel="Browse All Guides"
            ctaHref="/guides"
            helperText="Free download • Just your details, no signup"
          />
          <CategoryColumn
            icon={ClipboardList}
            step={2}
            title="Guided Worksheets"
            description="Step-by-step frameworks to plan your growth."
            items={toItems(worksheets)}
            preview={<WorksheetPreview />}
            ctaLabel="Start a Worksheet"
            ctaHref={`/tools/${worksheets[0].slug}`}
            helperText="3-5 minutes • Get instant results"
          />
          <CategoryColumn
            icon={Stethoscope}
            step={3}
            title="Diagnostics"
            description="Assess your performance and identify gaps."
            items={toItems(diagnostics)}
            preview={<DiagnosticPreview />}
            ctaLabel="Check Your Score"
            ctaHref={`/tools/${diagnostics[0].slug}`}
            helperText="2-3 minutes • Get your score"
          />
          <CategoryColumn
            icon={Calculator}
            step={4}
            title="Growth Calculators"
            description="Calculate impact, cost, and growth opportunities."
            items={toItems(calculators)}
            preview={<CalculatorPreview />}
            ctaLabel="Use a Calculator"
            ctaHref={`/tools/${calculators[0].slug}`}
            helperText="Instant results • No signup to start"
          />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/40 px-6 py-5 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[linear-gradient(to_bottom_right,var(--primary-glow),var(--primary))] text-primary-foreground">
              <Gift className="size-5" />
            </span>
            <div>
              <p className="font-medium">All tools are 100% free. No hidden charges.</p>
              <p className="text-sm text-muted-foreground">Built for manufacturing & B2B teams — actionable, not generic.</p>
            </div>
          </div>
          <Button nativeButton={false} render={<Link href="/assessment/start" />}>
            Get Your Full Growth Assessment <ArrowRight />
          </Button>
        </div>
      </main>
    </div>
  );
}
