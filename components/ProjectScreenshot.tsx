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

/**
 * A screenshot of a project (the first by default). Until there is one, a designed
 * placeholder: a browser-window frame with the project name and a stripe for each layer
 * the project uses, plus a small TODO note. The frame clips its content, so inside a
 * `.project-item` the image can zoom slightly on hover.
 */
export function ProjectScreenshot({
  project,
  sizes,
  priority = false,
  index = 0,
}: ProjectScreenshotProps) {
  const screenshot = project.screenshots[index];

  if (!screenshot) {
    const layers = [...new Set(project.stack.map((tech) => tech.layer))];

    return (
      <div aria-hidden="true" className="rule shot">
        <div className="shot-inner">
          <div className="window-bar rule">
            <span className="window-dot" />
            <span className="window-dot" />
            <span className="window-dot" />
          </div>
          <div className="window-body">
            <p className="placeholder-title">{project.title}</p>
            <div className="grid gap-1.5">
              {layers.map((layer) => (
                <span key={layer} data-layer={layer} className="layer-fill block h-1" />
              ))}
            </div>
            <p className="type-small">TODO: screenshot</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rule shot">
      <Image
        src={screenshot.src}
        alt={screenshot.alt}
        width={screenshot.width}
        height={screenshot.height}
        sizes={sizes}
        priority={priority}
        className="shot-inner h-auto w-full"
      />
    </div>
  );
}
