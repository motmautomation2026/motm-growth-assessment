// Google Chat incoming webhook — fire-and-forget lead alerts. Gracefully
// skips when unconfigured (same pattern as email.ts / RESEND_API_KEY), and
// never throws into the caller: a notification failure must not block a
// real lead's submission from completing.
async function postToGoogleChat(text: string): Promise<void> {
  const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    console.error("Google Chat notification failed:", err);
  }
}

export async function notifyAssessmentCompleted(input: {
  contactName: string;
  email: string;
  phone?: string | null;
  companyName: string;
  overallScore: number;
  dashboardUrl: string;
}): Promise<void> {
  const text =
    `🎯 *New Growth Assessment completed*\n` +
    `*${input.companyName}* — ${input.contactName}\n` +
    `${input.email}${input.phone ? ` · ${input.phone}` : ""}\n` +
    `Overall Score: *${input.overallScore}/100*\n` +
    `<${input.dashboardUrl}|View Dashboard>`;
  await postToGoogleChat(text);
}

export async function notifyGuideDownloaded(input: {
  contactName: string;
  email: string;
  companyName: string;
  guideTitle: string;
}): Promise<void> {
  const text =
    `📄 *New guide download*\n` +
    `*${input.companyName}* — ${input.contactName}\n` +
    `${input.email}\n` +
    `Guide: ${input.guideTitle}`;
  await postToGoogleChat(text);
}

export async function notifyMicroToolSubmitted(input: {
  contactName: string;
  email: string;
  companyName: string;
  toolName: string;
  resultUrl: string;
}): Promise<void> {
  const text =
    `🔧 *New ${input.toolName} submission*\n` +
    `*${input.companyName}* — ${input.contactName}\n` +
    `${input.email}\n` +
    `<${input.resultUrl}|View Result>`;
  await postToGoogleChat(text);
}
