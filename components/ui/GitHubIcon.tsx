import { siGithub } from "simple-icons";
import { cn } from "@/lib/utils";

/**
 * The GitHub mark from simple-icons, in `currentColor`. Decorative: the button or link
 * always has a text label. Imported by name, so only this logo is bundled.
 */
export function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn("size-5 shrink-0", className)}
    >
      <path d={siGithub.path} />
    </svg>
  );
}
