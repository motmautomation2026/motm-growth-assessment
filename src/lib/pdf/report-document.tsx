import path from "node:path";
import fs from "node:fs";
import { Document, Page, Text, View, StyleSheet, Image as PdfImage, Link } from "@react-pdf/renderer";
import type { ScoreResultOutput } from "@/lib/engine/scoring";
import type { CalculatorOutput } from "@/lib/engine/calculators";
import type { AIReportSections } from "@/lib/ai/generateReport";
import { formatCurrency, type CurrencyCode } from "@/lib/currency";

// Read into a Buffer rather than passing the path string as `src` — react-pdf's
// local-file detection can misparse Windows-style backslash paths and silently
// fall back to a (failing) fetch() attempt. A Buffer sidesteps that entirely.
const LOGO_BUFFER = fs.readFileSync(path.join(process.cwd(), "public", "logo.jpg"));
// Real aspect ratio (1097x929) so the logo never gets stretched/squashed.
const LOGO_ASPECT_RATIO = 1097 / 929;

const BLUE = "#2a78d6";
const BLUE_DARK = "#184f95";
const INK = "#0b0b0b";
const MUTED = "#52514e";
const BORDER = "#e1e0d9";
const GREEN = "#0ca30c";
const YELLOW = "#fab219";
const RED = "#d03b3b";

const bandColor = (score: number) => (score >= 70 ? GREEN : score >= 40 ? YELLOW : RED);

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: INK,
  },
  coverPage: {
    padding: 56,
    fontFamily: "Helvetica",
    color: INK,
    justifyContent: "space-between",
  },
  logoHeader: { height: 32, width: 32 * LOGO_ASPECT_RATIO },
  logoCover: { height: 68, width: 68 * LOGO_ASPECT_RATIO },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerBrand: { flexDirection: "row", alignItems: "center", gap: 6 },
  pageTitle: { fontSize: 9, color: MUTED },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: MUTED,
  },
  h1: { fontSize: 22, fontFamily: "Helvetica-Bold", marginBottom: 10, color: INK },
  h2: { fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 8, color: INK },
  body: { fontSize: 10.5, lineHeight: 1.6, color: "#2b2a28" },
  muted: { fontSize: 9.5, color: MUTED },
  section: { marginBottom: 18 },
  bullet: { flexDirection: "row", marginBottom: 5, gap: 6 },
  bulletDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: BLUE, marginTop: 4 },
  bulletText: { fontSize: 10, lineHeight: 1.5, color: "#2b2a28", flex: 1 },
  scoreRow: { marginBottom: 12 },
  scoreRowTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  scoreLabel: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  scoreValue: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  barTrack: { height: 6, borderRadius: 3, backgroundColor: "#eef1f5", width: "100%" },
  barFill: { height: 6, borderRadius: 3 },
  statGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 6 },
  statTile: {
    width: "31%",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 6,
    padding: 10,
  },
  statLabel: { fontSize: 8.5, color: MUTED, marginBottom: 4 },
  statValue: { fontSize: 14, fontFamily: "Helvetica-Bold" },
  table: { borderWidth: 1, borderColor: BORDER, borderRadius: 4, marginBottom: 10 },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRowLast: { borderBottomWidth: 0 },
  tableCellLabel: { flex: 1, fontSize: 9.5, color: MUTED },
  tableCellValue: { flex: 1, fontSize: 9.5, fontFamily: "Helvetica-Bold", textAlign: "right" },
});

function Header({ title }: { title: string }) {
  return (
    <View style={styles.header} fixed>
      <View style={styles.headerBrand}>
        <PdfImage src={LOGO_BUFFER} style={styles.logoHeader} />
      </View>
      <Text style={styles.pageTitle}>{title}</Text>
    </View>
  );
}

function Footer() {
  return (
    <View style={styles.footer} fixed>
      <Text>Confidential — prepared for internal use</Text>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = bandColor(score);
  return (
    <View style={styles.scoreRow}>
      <View style={styles.scoreRowTop}>
        <Text style={styles.scoreLabel}>{label}</Text>
        <Text style={[styles.scoreValue, { color }]}>{score}/100</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${score}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((item, i) => (
        <View key={i} style={styles.bullet}>
          <View style={styles.bulletDot} />
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function AnalysisPage({ title, pageLabel, text }: { title: string; pageLabel: string; text: string }) {
  return (
    <Page size="A4" style={styles.page}>
      <Header title={pageLabel} />
      <Text style={styles.h1}>{title}</Text>
      <Text style={styles.body}>{text}</Text>
      <Footer />
    </Page>
  );
}

export type ReportDocumentProps = {
  company: {
    name: string;
    industry?: string | null;
    employees?: string | null;
    revenueRange?: string | null;
    website?: string | null;
    avgDealSize?: number | null;
    currency?: string;
  };
  scores: ScoreResultOutput;
  calculators: CalculatorOutput;
  sections: AIReportSections;
  generatedAt: Date;
  bookingUrl: string;
};

export function ReportDocument({
  company,
  scores,
  calculators,
  sections,
  generatedAt,
  bookingUrl,
}: ReportDocumentProps) {
  const currency = (n: number) => formatCurrency(n, (company.currency as CurrencyCode) ?? "INR");
  return (
    <Document title={`${company.name} — MOTM Growth Assessment`}>
      {/* Cover */}
      <Page size="A4" style={styles.coverPage}>
        <PdfImage src={LOGO_BUFFER} style={styles.logoCover} />
        <View>
          <Text style={{ fontSize: 11, color: MUTED, marginBottom: 8 }}>
            B2B Growth Assessment Report
          </Text>
          <Text style={{ fontSize: 30, fontFamily: "Helvetica-Bold", marginBottom: 10 }}>
            {company.name}
          </Text>
          <Text style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>
            {[company.industry, company.employees ? `${company.employees} employees` : null]
              .filter(Boolean)
              .join(" · ")}
          </Text>
          <Text style={{ fontSize: 10, color: MUTED }}>
            Generated {generatedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </Text>
        </View>
        <View>
          <View style={{ marginBottom: 16 }}>
            <ScoreBar label="Overall Growth Score" score={scores.overallScore} />
          </View>
          <Text style={{ fontSize: 9, color: MUTED }}>
            Prepared by MOTM — <Link href={bookingUrl} style={{ color: MUTED }}>Book a Consultation</Link>
          </Text>
        </View>
      </Page>

      {/* Executive Summary + Score Overview */}
      <Page size="A4" style={styles.page}>
        <Header title="Executive Summary" />
        <Text style={styles.h1}>Executive Summary</Text>
        <Text style={[styles.body, { marginBottom: 20 }]}>{sections.executiveSummary}</Text>

        <Text style={styles.h2}>Growth Score Overview</Text>
        <ScoreBar label="ICP Fit" score={scores.icpScore} />
        <ScoreBar label="Sales" score={scores.salesScore} />
        <ScoreBar label="Marketing" score={scores.marketingScore} />
        <ScoreBar label="Automation" score={scores.automationScore} />
        <ScoreBar label="CRM" score={scores.crmScore} />
        <ScoreBar label="Lead Generation" score={scores.leadGenScore} />
        <ScoreBar label="Digital Presence" score={scores.digitalPresenceScore} />
        <Footer />
      </Page>

      {/* Business Snapshot */}
      <Page size="A4" style={styles.page}>
        <Header title="Business Snapshot" />
        <Text style={styles.h1}>Business Snapshot</Text>
        <Text style={[styles.body, { marginBottom: 16 }]}>{sections.businessSnapshot}</Text>
        <View style={styles.table}>
          {[
            ["Company", company.name],
            ["Industry", company.industry ?? "—"],
            ["Employees", company.employees ?? "—"],
            ["Revenue Range", company.revenueRange ?? "—"],
            ["Website", company.website ?? "—"],
            ["Average Deal Size", company.avgDealSize ? currency(company.avgDealSize) : "—"],
          ].map(([label, value], i, arr) => (
            <View key={label} style={[styles.tableRow, i === arr.length - 1 ? styles.tableRowLast : {}]}>
              <Text style={styles.tableCellLabel}>{label}</Text>
              <Text style={styles.tableCellValue}>{value}</Text>
            </View>
          ))}
        </View>
        <Footer />
      </Page>

      <AnalysisPage title="ICP Analysis" pageLabel="ICP Analysis" text={sections.icpAnalysis} />
      <AnalysisPage
        title="Decision Maker Mapping"
        pageLabel="Decision Makers"
        text={sections.decisionMakerAnalysis}
      />

      {/* Sales Funnel Analysis */}
      <Page size="A4" style={styles.page}>
        <Header title="Sales Funnel Analysis" />
        <Text style={styles.h1}>Sales Funnel Analysis</Text>
        <Text style={[styles.body, { marginBottom: 16 }]}>{sections.salesFunnelAnalysis}</Text>
        <Text style={styles.h2}>Key Metrics</Text>
        <View style={styles.statGrid}>
          <View style={styles.statTile}>
            <Text style={styles.statLabel}>Lead → Qualified</Text>
            <Text style={styles.statValue}>{calculators.leadConversionRate}%</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statLabel}>Qualified → Meeting</Text>
            <Text style={styles.statValue}>{calculators.meetingRate}%</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statLabel}>Meeting → RFQ</Text>
            <Text style={styles.statValue}>{calculators.rfqRate}%</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statLabel}>Proposal → Close</Text>
            <Text style={styles.statValue}>{calculators.closeRate}%</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statLabel}>Weakest Stage</Text>
            <Text style={[styles.statValue, { fontSize: 11 }]}>{calculators.weakestStage}</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statLabel}>Pipeline Health</Text>
            <Text style={styles.statValue}>{calculators.pipelineHealth}/100</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statLabel}>Est. Lost Revenue / mo</Text>
            <Text style={[styles.statValue, { color: RED }]}>{currency(calculators.estimatedLostRevenue)}</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statLabel}>Growth Opportunity / mo</Text>
            <Text style={[styles.statValue, { color: GREEN }]}>
              {currency(calculators.estimatedGrowthOpportunity)}
            </Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statLabel}>Sales Velocity / day</Text>
            <Text style={styles.statValue}>{currency(calculators.salesVelocity)}</Text>
          </View>
        </View>
        <Footer />
      </Page>

      <AnalysisPage title="Marketing Analysis" pageLabel="Marketing" text={sections.marketingAnalysis} />
      <AnalysisPage
        title="Lead Generation Analysis"
        pageLabel="Lead Generation"
        text={sections.leadGenerationAnalysis}
      />
      <AnalysisPage title="Automation Analysis" pageLabel="Automation" text={sections.automationAnalysis} />
      <AnalysisPage
        title="Digital Presence"
        pageLabel="Digital Presence"
        text={sections.digitalPresenceAnalysis}
      />
      <AnalysisPage
        title="Competitor Readiness"
        pageLabel="Competitor Readiness"
        text={sections.competitorReadiness}
      />

      {/* Opportunities / Risks / Quick Wins */}
      <Page size="A4" style={styles.page}>
        <Header title="Growth Opportunities" />
        <View style={styles.section}>
          <Text style={styles.h1}>Growth Opportunities</Text>
          <BulletList items={sections.growthOpportunities} />
        </View>
        <View style={styles.section}>
          <Text style={styles.h2}>Risks</Text>
          <BulletList items={sections.risks} />
        </View>
        <View style={styles.section}>
          <Text style={styles.h2}>Quick Wins</Text>
          <BulletList items={sections.quickWins} />
        </View>
        <Footer />
      </Page>

      {/* Roadmap */}
      <Page size="A4" style={styles.page}>
        <Header title="Growth Roadmap" />
        <Text style={styles.h1}>Your Growth Roadmap</Text>
        <View style={styles.section}>
          <Text style={styles.h2}>First 30 Days</Text>
          <BulletList items={sections.plan30Days} />
        </View>
        <View style={styles.section}>
          <Text style={styles.h2}>Days 31-60</Text>
          <BulletList items={sections.plan60Days} />
        </View>
        <View style={styles.section}>
          <Text style={styles.h2}>Days 61-90</Text>
          <BulletList items={sections.plan90Days} />
        </View>
        <Footer />
      </Page>

      {/* Priority Matrix */}
      <Page size="A4" style={styles.page}>
        <Header title="Priority Matrix" />
        <Text style={styles.h1}>Priority Matrix</Text>
        <Text style={[styles.body, { marginBottom: 16 }]}>
          A simple way to sequence the recommendations above: start with quick wins (high impact, low
          effort), then invest in growth opportunities, while actively managing the identified risks.
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCellLabel, { fontFamily: "Helvetica-Bold", color: INK }]}>Item</Text>
            <Text style={[styles.tableCellValue, { fontFamily: "Helvetica-Bold", color: INK }]}>Priority</Text>
          </View>
          {sections.quickWins.map((item, i) => (
            <View key={`qw-${i}`} style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>{item}</Text>
              <Text style={[styles.tableCellValue, { color: GREEN }]}>Do First</Text>
            </View>
          ))}
          {sections.growthOpportunities.map((item, i) => (
            <View key={`go-${i}`} style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>{item}</Text>
              <Text style={[styles.tableCellValue, { color: BLUE_DARK }]}>Invest</Text>
            </View>
          ))}
          {sections.risks.map((item, i, arr) => (
            <View
              key={`risk-${i}`}
              style={[styles.tableRow, i === arr.length - 1 ? styles.tableRowLast : {}]}
            >
              <Text style={styles.tableCellLabel}>{item}</Text>
              <Text style={[styles.tableCellValue, { color: RED }]}>Mitigate</Text>
            </View>
          ))}
        </View>
        <Footer />
      </Page>

      {/* About + Contact */}
      <Page size="A4" style={styles.page}>
        <Header title="About & Contact" />
        <Text style={styles.h1}>About MOTM</Text>
        <Text style={[styles.body, { marginBottom: 24 }]}>
          MOTM helps manufacturing and B2B companies build predictable, scalable sales and marketing
          engines — from ICP definition through funnel design, lead generation, and revenue operations.
          This assessment is the first step in identifying where your biggest growth opportunities are
          hiding.
        </Text>
        <Text style={styles.h2}>Ready to Act on These Recommendations?</Text>
        <Text style={styles.body}>
          Book a free consultation with our team to walk through this report and build a plan tailored
          to {company.name}.
        </Text>
        <Link href={bookingUrl} style={{ marginTop: 10, fontSize: 11, fontFamily: "Helvetica-Bold", color: BLUE }}>
          Book a Consultation →
        </Link>
        <Footer />
      </Page>
    </Document>
  );
}
