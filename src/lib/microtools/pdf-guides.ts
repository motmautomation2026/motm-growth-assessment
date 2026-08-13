// Stage-1 PDF guides from the lead-magnet ladder. Files live in public/guides/.
// `slug` is explicit (not derived from title) so it stays stable if a title
// is reworded later — it's what /guides/[slug] and stored leads key off of.
export type PdfGuide = { slug: string; title: string; href: string };

export const PDF_GUIDES: PdfGuide[] = [
  {
    slug: "b2b-lead-generation-guide",
    title: "B2B Lead Generation Guide",
    href: "/guides/B2B-Lead-Generation-Guide-MOTM.pdf",
  },
  {
    slug: "b2b-lead-conversion-guide",
    title: "B2B Lead Conversion Guide",
    href: "/guides/B2B-Lead-Conversion-Guide-MOTM.pdf",
  },
  {
    slug: "icp-definition-guide",
    title: "How to Define Your Ideal Customer Profile (ICP)",
    href: "/guides/How-to-Define-Your-Ideal-Customer-Profile-ICP-MOTM.pdf",
  },
  {
    slug: "improve-lead-conversion-rate-guide",
    title: "How to Improve Your B2B Lead Conversion Rate",
    href: "/guides/How-to-Improve-Your-B2B-Lead-Conversion-Rate-MOTM.pdf",
  },
  {
    slug: "email-linkedin-templates-guide",
    title: "100 High-Converting B2B Email & LinkedIn Templates",
    href: "/guides/100-High-Converting-B2B-Email-and-LinkedIn-Templates-MOTM.pdf",
  },
  {
    slug: "cold-email-playbook",
    title: "The Complete B2B Cold Email Playbook",
    href: "/guides/The-Complete-B2B-Cold-Email-Playbook-MOTM.pdf",
  },
  {
    slug: "linkedin-lead-generation-guide",
    title: "The Ultimate LinkedIn Lead Generation Guide",
    href: "/guides/The-Ultimate-LinkedIn-Lead-Generation-Guide-MOTM.pdf",
  },
  {
    slug: "sales-follow-up-playbook",
    title: "The Ultimate B2B Sales Follow-Up Playbook",
    href: "/guides/The-Ultimate-B2B-Sales-Follow-Up-Playbook-MOTM.pdf",
  },
  {
    slug: "sales-pipeline-management-guide",
    title: "The Complete B2B Sales Pipeline Management Guide",
    href: "/guides/The-Complete-B2B-Sales-Pipeline-Management-Guide-MOTM.pdf",
  },
  {
    slug: "sales-analytics-kpi-guide",
    title: "The Complete B2B Sales Analytics & KPI Guide",
    href: "/guides/The-Complete-B2B-Sales-Analytics-and-KPI-Guide-MOTM.pdf",
  },
  {
    slug: "abm-guide",
    title: "The Complete Account-Based Marketing (ABM) Guide",
    href: "/guides/The-Complete-Account-Based-Marketing-ABM-Guide-MOTM.pdf",
  },
  {
    slug: "ai-for-b2b-sales-marketing-guide",
    title: "The Complete AI for B2B Sales & Marketing Guide",
    href: "/guides/The-Complete-AI-for-B2B-Sales-and-Marketing-Guide-MOTM.pdf",
  },
  {
    slug: "crm-implementation-guide",
    title: "The Complete CRM Implementation Guide",
    href: "/guides/The-Complete-CRM-Implementation-Guide-MOTM.pdf",
  },
  {
    slug: "distributor-dealer-development-guide",
    title: "The Complete Distributor & Dealer Development Guide",
    href: "/guides/The-Complete-Distributor-and-Dealer-Development-Guide-MOTM.pdf",
  },
  {
    slug: "manufacturing-growth-playbook",
    title: "The Complete Manufacturing Growth Playbook",
    href: "/guides/The-Complete-Manufacturing-Growth-Playbook-MOTM.pdf",
  },
];

export function getGuideBySlug(slug: string): PdfGuide | undefined {
  return PDF_GUIDES.find((g) => g.slug === slug);
}
