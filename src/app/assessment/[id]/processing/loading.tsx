"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { Logo } from "@/components/brand/logo";

const STEPS = [
  "Scoring your ICP fit",
  "Analyzing your sales funnel",
  "Evaluating marketing maturity",
  "Generating growth recommendations",
];

export default function ProcessingLoading() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 font-heading text-base font-semibold tracking-tight"
      >
        <Logo size={88} />
      </Link>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex size-16 items-center justify-center rounded-2xl bg-[linear-gradient(to_bottom_right,var(--primary-glow),var(--primary))] text-primary-foreground shadow-lg shadow-primary/30"
      >
        <Sparkles className="size-7" />
      </motion.div>

      <h1 className="mt-8 font-heading text-2xl font-bold tracking-tight">
        Analyzing your business…
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Our AI is scoring your funnel, ICP fit, and marketing maturity to build your
        personalized growth report.
      </p>

      <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        This usually takes about 15-30 seconds
      </div>

      <ul className="mt-10 space-y-3 text-left">
        {STEPS.map((step, i) => (
          <motion.li
            key={step}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.25, duration: 0.4 }}
            className="flex items-center gap-2.5 text-sm text-muted-foreground"
          >
            <span className="size-1.5 rounded-full bg-primary" />
            {step}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
