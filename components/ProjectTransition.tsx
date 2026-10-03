import { ViewTransition, type ReactNode } from "react";

type ProjectTransitionProps = {
  slug: string;
  /** Which part of the project morphs: the title or the screenshot */
  part: "title" | "shot";
  children: ReactNode;
};

/**
 * Gives a project's title or screenshot a shared name. The list and the case-study page
 * use the same name, so the browser morphs one into the other when you open a project
 * (and back). `default="none"` keeps it from animating on unrelated navigations.
 * Browsers without View Transitions simply navigate as usual.
 */
export function ProjectTransition({ slug, part, children }: ProjectTransitionProps) {
  return (
    <ViewTransition name={`project-${part}-${slug}`} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
