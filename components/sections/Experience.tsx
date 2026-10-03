import { GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { BorderFlowRing } from "@/components/ui/BorderFlowRing";
import { LayerLegend } from "@/components/ui/LayerLegend";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechBadge } from "@/components/ui/TechBadge";
import { education, experience } from "@/data/experience";
import type { EducationItem } from "@/data/types";
import { formatDuration, formatMonth, resolveMonth } from "@/lib/dates";

// `satisfies` keeps the data's exact shape; here every optional field has to be readable
const studies: EducationItem[] = education;

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="section section-alt">
      <div className="container-page">
        <SectionHeading id="experience-heading" aside={<LayerLegend />}>
          Experience
        </SectionHeading>

        <ol className="timeline" data-timeline>
          {experience.map((job) => (
            <li key={job.company} className="timeline-item" data-reveal="fade">
              <h3 className="type-h3">{job.role}</h3>
              <p className="type-body mt-1">{job.company}</p>
              <p className="type-small mt-1">
                <time dateTime={job.start}>{formatMonth(job.start)}</time> to{" "}
                <time dateTime={resolveMonth(job.end)}>{formatMonth(job.end)}</time>,{" "}
                {formatDuration(job.start, job.end)}. {job.location}
              </p>

              <ul className="type-body mt-4 list-disc space-y-2 pl-5">
                {job.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>

              <ul className="mt-4 flex flex-wrap gap-2">
                {job.tech.map((tech) => (
                  <li key={tech.name}>
                    <TechBadge name={tech.name} layer={tech.layer} />
                  </li>
                ))}
              </ul>
            </li>
          ))}

          {/* Study continues the same line as the jobs (newest first), with square dots */}
          <li className="timeline-label" data-reveal="fade">
            <h3 className="type-h3">Education</h3>
          </li>
          {studies.map((item) => (
            <li
              key={`${item.qualification}-${item.start}`}
              className="timeline-item timeline-item-study"
              data-reveal="fade"
            >
              <article className="border-flow glass max-w-3xl rounded-lg p-4 sm:p-5">
                <BorderFlowRing />
                <div className="flex items-start gap-3">
                  <GraduationCap
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-sky-700 dark:text-sky-300"
                  />
                  <div className="min-w-0">
                    <h4 className="font-display text-lg font-semibold">{item.qualification}</h4>
                    <p className="type-body mt-1">{item.institution}</p>
                    <p className="type-small mt-1">
                      {item.start} to {item.end}
                      {item.location ? `, ${item.location}` : ""}
                      {item.grade ? `. Grade ${item.grade}` : ""}
                    </p>

                    {item.project ? (
                      <p className="type-body mt-3">Final-year project: {item.project}</p>
                    ) : null}
                    {item.coursework?.length ? (
                      <p className="type-body mt-3">Coursework: {item.coursework.join(", ")}</p>
                    ) : null}
                    {item.certifications?.length ? (
                      <ul aria-label="Certifications" className="mt-3 flex flex-wrap gap-2">
                        {item.certifications.map((certification) => (
                          <li key={certification}>
                            <Badge>{certification}</Badge>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
