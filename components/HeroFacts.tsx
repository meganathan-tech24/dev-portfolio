import Link from "next/link";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { PRESENT, yearsOfExperience } from "@/lib/dates";

/** The three facts under the hero actions. Everything is computed from /data at build time. */
export function HeroFacts({ className }: { className?: string }) {
  const { hero } = site;
  const years = yearsOfExperience(experience);
  const current = experience.find((job) => job.end === PRESENT) ?? experience[0];
  const latest = projects.find((project) => project.featured) ?? projects[0];

  return (
    <dl className={className}>
      <div>
        <dt className="fact-key">{hero.experienceLabel}</dt>
        <dd>
          <span className="fact-value">
            {years}+ {hero.yearsUnit}
          </span>
          {/* One segment per year */}
          <span aria-hidden="true" className="year-bars">
            {Array.from({ length: years }, (_, year) => (
              <span key={year} className="year-bar" />
            ))}
          </span>
        </dd>
      </div>
      <div>
        <dt className="fact-key">{hero.nowAtLabel}</dt>
        <dd>
          <span className="fact-value">{current.company}</span>
          <span className="fact-note">{current.role}</span>
        </dd>
      </div>
      <div>
        <dt className="fact-key">{hero.latestLabel}</dt>
        <dd>
          <Link href={`/projects/${latest.slug}`} className="fact-link">
            <span className="fact-value">{latest.title}</span>
            <span className="fact-note fact-underline">{hero.caseStudy}</span>
          </Link>
        </dd>
      </div>
    </dl>
  );
}
