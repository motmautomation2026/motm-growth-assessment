import Image from "next/image";
import { cn } from "@/lib/utils";

// Real aspect ratio (1097x929) so the logo never gets stretched/squashed.
const LOGO_ASPECT_RATIO = 1097 / 929;

export function Logo({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo.jpg"
      alt="MOTM"
      width={size}
      height={Math.round(size / LOGO_ASPECT_RATIO)}
      priority
      className={cn("rounded-md object-contain", className)}
    />
  );
}
