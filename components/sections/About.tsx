import Image from "next/image";
import { BorderFlowRing } from "@/components/ui/BorderFlowRing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experience } from "@/data/experience";
import { site } from "@/data/site";
import { formatMonth, yearsOfExperience } from "@/lib/dates";
import { isTodo } from "@/lib/utils";

export function About() {
  const { photo } = site;
  const since = experience.map((job) => job.start).sort()[0];
  // first letters of the name, e.g. "MP"
  const initials = site.name
    .split(" ")
    .map((word) => word[0])
    .join("");

  return (
    <section id="about" aria-labelledby="about-heading" className="section">
      <div className="container-page">
        <SectionHeading id="about-heading">About</SectionHeading>

        <div className="grid items-start gap-8 md:grid-cols-3 md:gap-12">
          {isTodo(photo.src) ? (
            <div data-reveal="fade">
              <div
                aria-hidden="true"
                className="layer-frame flex aspect-square items-center justify-center"
              >
                <span className="placeholder-title">{initials}</span>
              </div>
              <p className="type-small mt-2">TODO: photo</p>
            </div>
          ) : (
            <div data-reveal="fade" className="border-flow rounded-lg">
              <BorderFlowRing />
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 1152px) 352px, (min-width: 768px) 30vw, 100vw"
                className="block h-auto w-full rounded-lg"
              />
            </div>
          )}

          <div data-reveal="fade" className="space-y-4 md:col-span-2">
            {site.bio.map((paragraph) => (
              <p key={paragraph} className="type-body">
                {paragraph}
              </p>
            ))}
            <p className="type-small">
              {yearsOfExperience(experience)} years of professional experience, since{" "}
              {formatMonth(since)}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
