import path from "node:path";
import fs from "node:fs";
import { Document, Page, Text, View, StyleSheet, Image as PdfImage, Link } from "@react-pdf/renderer";
import { formatCurrency, type CurrencyCode } from "@/lib/currency";
import type { MicroToolOutput, MicroToolMetric, FieldConfig } from "@/lib/microtools/types";
import type { MicroToolAiSummary } from "@/lib/microtools/ai";

// Read into a Buffer rather than passing the path string as `src` — react-pdf's
// local-file detection can misparse Windows-style backslash paths and silently
// fall back to a (failing) fetch() attempt. A Buffer sidesteps that entirely.
const LOGO_BUFFER = fs.readFileSync(path.join(process.cwd(), "public", "logo.jpg"));
// Real aspect ratio (1097x929) so the logo never gets stretched/squashed.
const LOGO_ASPECT_RATIO = 1097 / 929;

function formatInputValue(value: unknown): string {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

const BLUE = "#2a78d6";
const INK = "#0b0b0b";
const MUTED = "#52514e";
const BORDER = "#e1e0d9";
const GREEN = "#0ca30c";
const YELLOW = "#fab219";
const RED = "#d03b3b";

const bandColor = (score: number) => (score >= 70 ? GREEN : score >= 40 ? YELLOW : RED);

const styles = StyleSheet.create({
  page: { paddingTop: 48, paddingBottom: 56, paddingHorizontal: 48, fontSize: 10, fontFamily: "Helvetica", color: INK },
  logoHeader: { height: 32, width: 32 * LOGO_ASPECT_RATIO },
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
  bullet: { flexDirection: "row", marginBottom: 5, gap: 6 },
  bulletDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: BLUE, marginTop: 4 },
  bulletText: { fontSize: 10, lineHeight: 1.5, color: "#2b2a28", flex: 1 },
  table: { borderWidth: 1, borderColor: BORDER, borderRadius: 4, marginBottom: 10 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: BORDER, paddingVertical: 6, paddingHorizontal: 8 },
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

export type MicroToolReportDocumentProps = {
  toolName: string;
  contactName: string;
  companyName: string;
  output: MicroToolOutput;
  aiSummary: MicroToolAiSummary;
  generatedAt: Date;
  bookingUrl: string;
  currency?: CurrencyCode;
  fields: FieldConfig[];
  inputs: Record<string, unknown>;
};

export function MicroToolReportDocument({
  toolName,
  contactName,
  companyName,
  output,
  aiSummary,
  generatedAt,
  bookingUrl,
  fields,
  inputs,
  currency = "INR",
}: MicroToolReportDocumentProps) {
  const formatMetric = (m: MicroToolMetric) =>
    "format" in m && m.format === "currency" ? formatCurrency(m.value, currency) : m.value;
  return (
    <Document title={`${companyName} — ${toolName}`}>
      {/* Page 1: Executive Summary */}
      <Page size="A4" style={styles.page}>
        <Header title={toolName} />
        <Text style={{ fontSize: 10, color: MUTED, marginBottom: 4 }}>Prepared for</Text>
        <Text style={styles.h1}>
          {contactName} · {companyName}
        </Text>
        {output.headline ? (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>{output.headline.label}</Text>
            <Text style={{ fontSize: 34, fontFamily: "Helvetica-Bold", color: bandColor(output.headline.score) }}>
              {output.headline.score}/100
            </Text>
          </View>
        ) : null}
        <Text style={styles.body}>{aiSummary.whatThisMeans}</Text>
        <Text style={{ fontSize: 9, color: MUTED, marginTop: 20 }}>
          Generated {generatedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </Text>
        <Footer />
      </Page>

      {/* Page 2: Input Snapshot */}
      <Page size="A4" style={styles.page}>
        <Header title="Input Snapshot" />
        <Text style={styles.h1}>What You Told Us</Text>
        <Text style={[styles.body, { marginBottom: 16 }]}>
          This report is calculated directly from the answers below — nothing here is guessed.
        </Text>
        <Text style={styles.h2}>Your Answers</Text>
        <View style={[styles.table, { marginBottom: 16 }]}>
          {fields.map((f, i, arr) => (
            <View key={f.name} style={[styles.tableRow, i === arr.length - 1 ? styles.tableRowLast : {}]}>
              <Text style={styles.tableCellLabel}>{f.label}</Text>
              <Text style={styles.tableCellValue}>{formatInputValue(inputs[f.name])}</Text>
            </View>
          ))}
        </View>
        {output.metrics?.length ? (
          <>
            <Text style={styles.h2}>Calculated Outputs</Text>
            <View style={styles.table}>
              {output.metrics.map((m, i, arr) => (
                <View key={m.label} style={[styles.tableRow, i === arr.length - 1 ? styles.tableRowLast : {}]}>
                  <Text style={styles.tableCellLabel}>{m.label}</Text>
                  <Text style={styles.tableCellValue}>{formatMetric(m)}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}
        <Footer />
      </Page>

      {/* Page 3: Score Breakdown / Findings */}
      <Page size="A4" style={styles.page}>
        <Header title="Findings" />
        <Text style={styles.h1}>Score Breakdown & Findings</Text>
        {output.sections?.map((s) => (
          <View key={s.label} style={{ marginBottom: 16 }}>
            <Text style={styles.h2}>{s.label}</Text>
            {Array.isArray(s.body) ? <BulletList items={s.body} /> : <Text style={styles.body}>{s.body}</Text>}
          </View>
        ))}
        {aiSummary.extraSections.map((s) => (
          <View key={s.label} style={{ marginBottom: 16 }}>
            <Text style={styles.h2}>{s.label}</Text>
            {Array.isArray(s.body) ? <BulletList items={s.body} /> : <Text style={styles.body}>{s.body}</Text>}
          </View>
        ))}
        <Footer />
      </Page>

      {/* Page 4: What This Means */}
      <Page size="A4" style={styles.page}>
        <Header title="What This Means" />
        <Text style={styles.h1}>What This Means For {companyName}</Text>
        <Text style={styles.body}>{aiSummary.whatThisMeans}</Text>
        <Footer />
      </Page>

      {/* Page 5: 30-Day Action Plan */}
      <Page size="A4" style={styles.page}>
        <Header title="30-Day Action Plan" />
        <Text style={styles.h1}>Recommended 30-Day Action Plan</Text>
        <BulletList items={aiSummary.actionPlan} />
        <Footer />
      </Page>

      {/* Page 6: MOTM Relevance + Contact */}
      <Page size="A4" style={styles.page}>
        <Header title="MOTM Relevance" />
        <Text style={styles.h1}>Where MOTM Can Help</Text>
        <Text style={[styles.body, { marginBottom: 24 }]}>{aiSummary.motmRelevance}</Text>
        <Text style={styles.h2}>Want to Talk It Through?</Text>
        <Text style={styles.body}>
          If it&apos;s the right time, we&apos;re happy to walk through this with you — no pressure either way.
        </Text>
        <Link href={bookingUrl} style={{ marginTop: 10, fontSize: 11, fontFamily: "Helvetica-Bold", color: BLUE }}>
          Book a Consultation →
        </Link>
        <Footer />
      </Page>
    </Document>
  );
}
