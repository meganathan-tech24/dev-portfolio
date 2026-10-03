import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skillGroups } from "@/data/skills";

export function Stack() {
  return (
    <section
      id="stack"
      aria-labelledby="stack-heading"
      className="section section-alt"
    >
      <div className="container-page">
        <SectionHeading
          id="stack-heading"
          description="The layers of a system I work on, from the interface down to the infrastructure."
        >
          Stack
        </SectionHeading>

        <div className="rule border-b">
          {skillGroups.map((group) => (
            <div
              key={group.layer}
              data-layer={group.layer}
              className="layer-band grid gap-4 md:grid-cols-3 md:gap-8"
            >
              <div>
                <h3 className="type-h3 layer-text">{group.label}</h3>
                <p className="type-body mt-2 text-neutral-600 dark:text-neutral-400">
                  {group.summary}
                </p>
              </div>
              <ul className="flex flex-wrap content-start gap-2 md:col-span-2">
                {group.skills.map((skill) => (
                  <li key={skill}>
                    <Badge>{skill}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
