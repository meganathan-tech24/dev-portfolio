import { Badge } from "@/components/ui/Badge";
import { LayerLegend } from "@/components/ui/LayerLegend";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { education, experience } from "@/data/experience";
import { formatDuration, formatMonth } from "@/lib/dates";

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="section section-alt"
    >
      <div className="container-page">
        <SectionHeading id="experience-heading" aside={<LayerLegend />}>
          Experience
        </SectionHeading>

        <ol>
          {experience.map((job) => (
            <li key={job.company} className="timeline-item">
              <h3 className="type-h3">{job.role}</h3>
              <p className="type-body mt-1">{job.company}</p>
              <p className="type-small mt-1">
                <time dateTime={job.start}>{formatMonth(job.start)}</time> to{" "}
                <time dateTime={job.end}>{formatMonth(job.end)}</time>,{" "}
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
                    <Badge layer={tech.layer}>{tech.name}</Badge>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <h3 className="type-h3 mt-16">Education</h3>
        <ul className="mt-6">
          {education.map((item) => (
            <li
              key={`${item.qualification}-${item.start}`}
              className="rule border-t py-4 first:border-t-0 first:pt-0"
            >
              <p className="font-display font-semibold">
                {item.qualification}
                {item.grade ? `, grade ${item.grade}` : ""}
              </p>
              <p className="type-small mt-1">
                {item.institution}, {item.start} to {item.end}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
