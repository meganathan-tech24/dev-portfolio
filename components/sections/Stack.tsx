import { LayerIcon } from "@/components/ui/LayerIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechBadge } from "@/components/ui/TechBadge";
import { skillGroups } from "@/data/skills";

export function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-heading" className="section section-alt">
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
              data-reveal="rule"
              className="layer-band grid gap-4 md:grid-cols-3 md:gap-8"
            >
              <div className="band-text">
                <h3 className="type-h3 layer-text flex items-center gap-2 font-bold">
                  <LayerIcon layer={group.layer} />
                  {group.label}
                </h3>
                <p className="type-body mt-2 text-neutral-600 dark:text-neutral-400">
                  {group.summary}
                </p>
              </div>
              <ul className="band-tags flex flex-wrap content-start gap-2 md:col-span-2">
                {group.skills.map((skill) => (
                  <li key={skill.name}>
                    <TechBadge name={skill.name} layer={group.layer} icon={skill.icon} />
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
