import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectScreenshot } from "@/components/ProjectScreenshot";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { skillGroups } from "@/data/skills";
import { canonical } from "@/lib/seo";
import type { Project } from "@/data/types";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project: Project | undefined = projects.find(
    (item) => item.slug === slug,
  );
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: canonical(`/projects/${project.slug}`),
    openGraph: {
      type: "article",
      title: `${project.title} | ${site.name}`,
      description: project.summary,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | ${site.name}`,
      description: project.summary,
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project: Project | undefined = projects.find(
    (item) => item.slug === slug,
  );
  if (!project) notFound();

  const { links, screenshots } = project;
  const stackByLayer = skillGroups
    .map((group) => ({
      ...group,
      tech: project.stack.filter((tech) => tech.layer === group.layer),
    }))
    .filter((group) => group.tech.length > 0);

  return (
    <main id="main" className="section">
      <article className="container-page">
        <Link href="/#projects" className="link">
          Back to projects
        </Link>

        <header className="mt-8">
          <h1 className="type-h2">{project.title}</h1>
          <p className="type-small mt-2">{project.company}</p>
          <p className="type-body mt-4">{project.summary}</p>
        </header>

        <div className="mt-10 grid gap-6">
          <ProjectScreenshot
            project={project}
            sizes="(min-width: 1152px) 1088px, 100vw"
            priority
          />
          {screenshots.slice(1).map((_, i) => (
            <ProjectScreenshot
              key={i}
              project={project}
              index={i + 1}
              sizes="(min-width: 1152px) 1088px, 100vw"
            />
          ))}
        </div>

        <div className="prose-case-study mt-12">
          <h2>The problem</h2>
          <p>{project.problem}</p>

          <h2>What I built</h2>
          <ul>
            {project.built.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2>My role</h2>
          <p>{project.role}</p>

          <h2>Stack</h2>
          <div className="grid gap-4">
            {stackByLayer.map((group) => (
              <div key={group.layer} data-layer={group.layer}>
                <h3 className="layer-text mt-0">{group.label}</h3>
                <ul className="mt-2 flex list-none flex-wrap gap-2 pl-0">
                  {group.tech.map((tech) => (
                    <li key={tech.name}>
                      <Badge>{tech.name}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h2>Challenges</h2>
          <p>{project.challenges}</p>

          <h2>Outcome</h2>
          <p>{project.outcome}</p>
        </div>

        {links.live || links.code ? (
          <div className="mt-10 flex flex-wrap gap-3">
            {links.live ? (
              <Button href={links.live}>Visit live site</Button>
            ) : null}
            {links.code ? (
              <Button href={links.code} variant="secondary">
                View code
              </Button>
            ) : null}
          </div>
        ) : null}
      </article>
    </main>
  );
}
