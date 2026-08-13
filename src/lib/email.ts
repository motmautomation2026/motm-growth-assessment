import { Resend } from "resend";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function reportEmailHtml(input: {
  contactName: string;
  companyName: string;
  overallScore: number;
  dashboardUrl: string;
  pdfUrl: string;
  bookingUrl: string;
}) {
  return `
  <div style="font-family: Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0b0b0b;">
    <div style="width: 32px; height: 32px; border-radius: 8px; background: #2a78d6; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 24px;">M</div>
    <h1 style="font-size: 20px; margin-bottom: 8px;">Your Growth Assessment is ready, ${escapeHtml(input.contactName)}</h1>
    <p style="font-size: 14px; line-height: 1.6; color: #52514e;">
      We analyzed ${escapeHtml(input.companyName)}'s sales funnel, ICP fit, and marketing maturity.
      Your Overall Growth Score is <strong>${input.overallScore}/100</strong>.
    </p>
    <div style="margin: 24px 0;">
      <a href="${input.dashboardUrl}" style="display: inline-block; background: #2a78d6; color: #fff; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-right: 10px;">
        View Your Dashboard
      </a>
      <a href="${input.pdfUrl}" style="display: inline-block; border: 1px solid #e1e0d9; color: #0b0b0b; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
        Download PDF Report
      </a>
    </div>
    <p style="font-size: 14px; line-height: 1.6; color: #52514e;">
      Want help acting on these recommendations?
      <a href="${input.bookingUrl}" style="color: #2a78d6;">Book a free consultation</a> with our team.
    </p>
  </div>`;
}

export async function sendReportEmail(input: {
  to: string;
  contactName: string;
  companyName: string;
  overallScore: number;
  dashboardUrl: string;
  pdfUrl: string;
  bookingUrl: string;
}): Promise<{ status: "SENT" | "SKIPPED" | "FAILED"; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    return { status: "SKIPPED", error: "RESEND_API_KEY is not configured" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL || "MOTM Growth Assessment <onboarding@resend.dev>";

  try {
    await resend.emails.send({
      from,
      to: input.to,
      subject: `Your ${input.companyName} Growth Assessment Results`,
      html: reportEmailHtml(input),
    });
    return { status: "SENT" };
  } catch (err) {
    return { status: "FAILED", error: err instanceof Error ? err.message : "Unknown error" };
  }
}

function microToolEmailHtml(input: {
  contactName: string;
  toolName: string;
  resultUrl: string;
  pdfUrl: string;
  bookingUrl: string;
}) {
  return `
  <div style="font-family: Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0b0b0b;">
    <div style="width: 32px; height: 32px; border-radius: 8px; background: #2a78d6; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 24px;">M</div>
    <h1 style="font-size: 20px; margin-bottom: 8px;">Your ${escapeHtml(input.toolName)} results are ready, ${escapeHtml(input.contactName)}</h1>
    <p style="font-size: 14px; line-height: 1.6; color: #52514e;">
      We put together your results with a short breakdown of what they mean and what to do next.
    </p>
    <div style="margin: 24px 0;">
      <a href="${input.resultUrl}" style="display: inline-block; background: #2a78d6; color: #fff; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-right: 10px;">
        View Your Results
      </a>
      <a href="${input.pdfUrl}" style="display: inline-block; border: 1px solid #e1e0d9; color: #0b0b0b; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
        Download PDF
      </a>
    </div>
    <p style="font-size: 14px; line-height: 1.6; color: #52514e;">
      Curious how this fits into the bigger picture?
      <a href="${input.bookingUrl}" style="color: #2a78d6;">Talk to our team</a> whenever you're ready — no pressure.
    </p>
  </div>`;
}

export async function sendMicroToolReportEmail(input: {
  to: string;
  contactName: string;
  toolName: string;
  resultUrl: string;
  pdfUrl: string;
  bookingUrl: string;
}): Promise<{ status: "SENT" | "SKIPPED" | "FAILED"; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    return { status: "SKIPPED", error: "RESEND_API_KEY is not configured" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL || "MOTM Growth Assessment <onboarding@resend.dev>";

  try {
    await resend.emails.send({
      from,
      to: input.to,
      subject: `Your ${input.toolName} Results`,
      html: microToolEmailHtml(input),
    });
    return { status: "SENT" };
  } catch (err) {
    return { status: "FAILED", error: err instanceof Error ? err.message : "Unknown error" };
  }
}
