import Image from "next/image";
import type { Project } from "@/data/types";

type ProjectScreenshotProps = {
  project: Project;
  /** Image sizes hint for next/image */
  sizes: string;
  priority?: boolean;
  /** Which screenshot to show; defaults to the first */
  index?: number;
};

/** A screenshot of a project (the first by default), or a marked TODO frame while there is none */
export function ProjectScreenshot({
  project,
  sizes,
  priority = false,
  index = 0,
}: ProjectScreenshotProps) {
  const screenshot = project.screenshots[index];

  if (!screenshot) {
    return (
      <div className="rule type-small flex aspect-video items-center rounded-lg border border-dashed bg-neutral-50 p-4 dark:bg-neutral-800/50">
        TODO: add a screenshot of {project.title}
      </div>
    );
  }

  return (
    <Image
      src={screenshot.src}
      alt={screenshot.alt}
      width={screenshot.width}
      height={screenshot.height}
      sizes={sizes}
      priority={priority}
      className="rule h-auto w-full rounded-lg border"
    />
  );
}
