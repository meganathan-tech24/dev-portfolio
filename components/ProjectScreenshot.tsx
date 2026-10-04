import Image from "next/image";
import type { Project, ProjectLogo } from "@/data/types";
import { cn } from "@/lib/utils";

/**
 * The logo. One with a dark version swaps with the theme (CSS only, so no flash); one without
 * sits on a white tile in dark mode, because dark logos disappear on a dark background.
 */
function ProjectLogoImage({ logo }: { logo: ProjectLogo }) {
  const { light, dark } = logo;
  const classes = "h-12 w-auto self-start rounded-md sm:h-14";

  return (
    <>
      <Image
        src={light.src}
        alt={logo.alt}
        width={light.width}
        height={light.height}
        className={cn(classes, dark ? "dark:hidden" : "dark:bg-white dark:p-2")}
      />
      {dark ? (
        <Image
          src={dark.src}
          alt={logo.alt}
          width={dark.width}
          height={dark.height}
          className={cn(classes, "hidden dark:block")}
        />
      ) : null}
    </>
  );
}

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
 * placeholder: a browser-window frame with the project's logo (or its name, if it has none)
 * and a stripe for each layer the project uses, plus a small TODO note. The frame clips its content, so inside a
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
            {project.logo ? (
              <ProjectLogoImage logo={project.logo} />
            ) : (
              <p className="placeholder-title">{project.title}</p>
            )}
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
