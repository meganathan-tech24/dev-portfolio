import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Used by the parent section's aria-labelledby */
  id: string;
  children: ReactNode;
  description?: ReactNode;
  /** Extra content under the description, such as a legend */
  aside?: ReactNode;
  className?: string;
};

export function SectionHeading({
  id,
  children,
  description,
  aside,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-10 sm:mb-12", className)}>
      <h2 id={id} className="type-h2">
        {children}
      </h2>
      {description ? (
        <p className="type-body mt-4 text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      ) : null}
      {aside}
    </div>
  );
}
