import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experience } from "@/data/experience";
import { site } from "@/data/site";
import { formatMonth, yearsOfExperience } from "@/lib/dates";
import { isTodo } from "@/lib/utils";

export function About() {
  const { photo } = site;
  const since = experience.map((job) => job.start).sort()[0];

  return (
    <section id="about" aria-labelledby="about-heading" className="section">
      <div className="container-page">
        <SectionHeading id="about-heading">About</SectionHeading>

        <div className="grid items-start gap-8 md:grid-cols-3 md:gap-12">
          {isTodo(photo.src) ? (
            <div className="rule type-small flex aspect-4/5 items-center rounded-lg border border-dashed bg-neutral-50 p-4 dark:bg-neutral-800/50">
              TODO: add a portrait photo
            </div>
          ) : (
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 1152px) 352px, (min-width: 768px) 30vw, 100vw"
              className="h-auto w-full rounded-lg"
            />
          )}

          <div className="space-y-4 md:col-span-2">
            {site.bio.map((paragraph) => (
              <p key={paragraph} className="type-body">
                {paragraph}
              </p>
            ))}
            <p className="type-small">
              {yearsOfExperience(experience)} years of professional experience,
              since {formatMonth(since)}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
