import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lightbulb, ShieldAlert, Zap } from "lucide-react";
import type { AIReportSections } from "@/lib/ai/generateReport";

const DEEP_DIVE_TABS: { value: string; label: string; key: keyof AIReportSections }[] = [
  { value: "snapshot", label: "Business Snapshot", key: "businessSnapshot" },
  { value: "icp", label: "ICP", key: "icpAnalysis" },
  { value: "decision-makers", label: "Decision Makers", key: "decisionMakerAnalysis" },
  { value: "funnel", label: "Sales Funnel", key: "salesFunnelAnalysis" },
  { value: "marketing", label: "Marketing", key: "marketingAnalysis" },
  { value: "lead-gen", label: "Lead Gen", key: "leadGenerationAnalysis" },
  { value: "automation", label: "Automation", key: "automationAnalysis" },
  { value: "digital", label: "Digital Presence", key: "digitalPresenceAnalysis" },
  { value: "competitor", label: "Competitor Readiness", key: "competitorReadiness" },
];

function ListCard({
  title,
  items,
  icon: Icon,
  accent,
}: {
  title: string;
  items: string[];
  icon: typeof Lightbulb;
  accent: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="size-4" style={{ color: accent }} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-current" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function PlanColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex-1 space-y-3 rounded-xl border border-border p-4">
      <h3 className="font-heading text-sm font-semibold">{title}</h3>
      <ol className="space-y-2 text-sm text-muted-foreground">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="font-medium text-foreground">{i + 1}.</span>
            {item}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function AIReportView({ sections }: { sections: AIReportSections }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">{sections.executiveSummary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Deep-Dive Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="snapshot">
            <TabsList className="flex-wrap justify-start overflow-x-auto">
              {DEEP_DIVE_TABS.map((t) => (
                <TabsTrigger key={t.value} value={t.value}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {DEEP_DIVE_TABS.map((t) => (
              <TabsContent key={t.value} value={t.value} className="pt-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {sections[t.key] as string}
                </p>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <ListCard title="Growth Opportunities" items={sections.growthOpportunities} icon={Lightbulb} accent="#0ca30c" />
        <ListCard title="Risks" items={sections.risks} icon={ShieldAlert} accent="#d03b3b" />
        <ListCard title="Quick Wins" items={sections.quickWins} icon={Zap} accent="#fab219" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Your Growth Roadmap</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row">
          <PlanColumn title="First 30 Days" items={sections.plan30Days} />
          <PlanColumn title="Days 31-60" items={sections.plan60Days} />
          <PlanColumn title="Days 61-90" items={sections.plan90Days} />
        </CardContent>
      </Card>
    </div>
  );
}
