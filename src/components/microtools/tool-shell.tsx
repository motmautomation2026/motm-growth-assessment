import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { StepTransition } from "@/components/wizard/step-transition";

export function ToolShell({
  title,
  tagline,
  children,
}: {
  title: string;
  tagline?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link href="https://www.motm.tech/" className="flex items-center gap-2 font-heading text-base font-semibold tracking-tight">
          <Logo size={88} />
        </Link>
        <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground">
          All Tools
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <StepTransition stepKey={title}>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-balance">{title}</h1>
          {tagline ? <p className="mt-1.5 max-w-xl text-muted-foreground">{tagline}</p> : null}
          <div className="mt-8">{children}</div>
        </StepTransition>
      </main>
    </div>
  );
}
