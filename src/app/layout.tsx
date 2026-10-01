import type { Metadata } from "next";
import { Urbanist, Outfit } from "next/font/google";
import "./globals.css";
import faviconMotm from "./favicon-motm.png";

// Matches motm.tech's live typography: Urbanist for headings, Outfit for body text.
const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "MOTM B2B Growth Assessment",
  description:
    "Discover your sales funnel health, ICP readiness, and growth opportunities in under 10 minutes.",
  icons: {
    icon: faviconMotm.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${urbanist.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
