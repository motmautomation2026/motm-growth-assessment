"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export default function ToolProcessingLoading() {
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
      <h1 className="mt-8 font-heading text-2xl font-bold tracking-tight">Calculating your results…</h1>
      <p className="mt-2 max-w-md text-muted-foreground">This usually takes just a few seconds.</p>
      <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Analyzing your answers
      </div>
    </div>
  );
}
