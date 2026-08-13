import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export class RateLimitError extends Error {
  constructor(message = "Too many requests. Please try again in a little while.") {
    super(message);
    this.name = "RateLimitError";
  }
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

/**
 * Sliding-window check backed by RateLimitHit. Throws RateLimitError if the
 * key has already hit `max` attempts for `action` within `windowMinutes`;
 * otherwise records this attempt and allows it through.
 */
async function enforce(key: string, action: string, max: number, windowMinutes: number) {
  const since = new Date(Date.now() - windowMinutes * 60 * 1000);
  const count = await prisma.rateLimitHit.count({
    where: { key, action, createdAt: { gte: since } },
  });
  if (count >= max) throw new RateLimitError();
  await prisma.rateLimitHit.create({ data: { key, action } });
}

/**
 * Rate-limits a public, cost-triggering action (AI generation + email send)
 * by both IP and email, whichever is stricter. Call before creating the
 * record that kicks off the costly work.
 */
export async function rateLimitSubmission(action: string, email: string) {
  const ip = await getClientIp();
  await enforce(`ip:${ip}`, action, 8, 60);
  await enforce(`email:${email.toLowerCase()}`, action, 5, 60);
}
