import Link from "next/link";
import { ProjectScreenshot } from "@/components/ProjectScreenshot";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LayerLegend } from "@/components/ui/LayerLegend";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/data/projects";
import type { Project } from "@/data/types";

/** Technologies shown on a list card; the case study has the full stack */
const CARD_TECH_LIMIT = 5;

function ProjectLinks({ project }: { project: Project }) {
  const { links, title, slug } = project;

  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      <li>
        <Link href={`/projects/${slug}`} className="link">
          Read case study<span className="sr-only"> for {title}</span>
        </Link>
      </li>
      {links.live ? (
        <li>
          <a
            href={links.live}
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit live site<span className="sr-only"> for {title}</span>
          </a>
        </li>
      ) : null}
      {links.code ? (
        <li>
          <a
            href={links.code}
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            View code<span className="sr-only"> for {title}</span>
          </a>
        </li>
      ) : null}
    </ul>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  const { links, title, slug } = project;

  return (
    <article className="rule layout-split rounded-lg border p-4 sm:p-8 md:items-center">
      <ProjectScreenshot
        project={project}
        sizes="(min-width: 1152px) 540px, (min-width: 768px) 45vw, 100vw"
      />
      <div>
        <h3 className="type-h3">{title}</h3>
        <p className="type-body mt-3">{project.summary}</p>
        <p className="type-small mt-3">{project.role}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li key={tech.name}>
              <Badge layer={tech.layer}>{tech.name}</Badge>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={`/projects/${slug}`}>
            Read case study<span className="sr-only"> for {title}</span>
          </Button>
          {links.live ? (
            <Button href={links.live} variant="secondary">
              Visit live site<span className="sr-only"> for {title}</span>
            </Button>
          ) : null}
          {links.code ? (
            <Button href={links.code} variant="secondary">
              View code<span className="sr-only"> for {title}</span>
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex h-full flex-col gap-4">
      <ProjectScreenshot
        project={project}
        sizes="(min-width: 1152px) 540px, (min-width: 640px) 45vw, 100vw"
      />
      <div>
        <h3 className="type-h3">{project.title}</h3>
        <p className="type-body mt-2">{project.summary}</p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {project.stack.slice(0, CARD_TECH_LIMIT).map((tech) => (
          <li key={tech.name}>
            <Badge layer={tech.layer}>{tech.name}</Badge>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}

export function Projects() {
  const featured = projects.find((project) => project.featured);
  const others = projects.filter((project) => project !== featured);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="section"
    >
      <div className="container-page">
        <SectionHeading
          id="projects-heading"
          aside={<LayerLegend />}
          description="Products I have worked on, each with its own case study."
        >
          Projects
        </SectionHeading>

        {featured ? <FeaturedProject project={featured} /> : null}

        {others.length > 0 ? (
          <ul className="layout-cards mt-12">
            {others.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
