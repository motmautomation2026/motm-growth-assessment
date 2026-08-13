import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CategoryItem = {
  label: string;
  href?: string;
};

export function CategoryColumn({
  icon: Icon,
  step,
  title,
  description,
  items,
  preview,
  ctaLabel,
  ctaHref,
  helperText,
}: {
  icon: LucideIcon;
  step: number;
  title: string;
  description: string;
  items: CategoryItem[];
  preview: React.ReactNode;
  ctaLabel: string;
  ctaHref: string;
  helperText: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-secondary/25 p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(to_bottom_right,var(--primary-glow),var(--primary))] text-primary-foreground">
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">Step {step}</p>
          <h3 className="font-heading text-lg font-semibold">{title}</h3>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>

      <ul className="mt-4 space-y-1">
        {items.map((item) => {
          const content = (
            <>
              <span className={cn("truncate", !item.href && "text-muted-foreground")}>{item.label}</span>
              {item.href ? (
                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
              ) : (
                <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Soon
                </span>
              )}
            </>
          );
          return (
            <li key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-background"
                >
                  {content}
                </Link>
              ) : (
                <div className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm">
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-4 rounded-xl border border-border bg-background p-3">{preview}</div>

      <div className="mt-4">
        <Button nativeButton={false} render={<Link href={ctaHref} />} className="w-full justify-center">
          {ctaLabel}
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">{helperText}</p>
      </div>
    </div>
  );
}
