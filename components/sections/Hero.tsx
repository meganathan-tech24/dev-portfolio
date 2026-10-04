import { ArrowDown, FileDown } from "lucide-react";
import { Fragment } from "react";
import { HeroFacts } from "@/components/HeroFacts";
import { HeroStage } from "@/components/HeroStage";
import { HeroState } from "@/components/HeroState";
import { RoleBlock } from "@/components/RoleBlock";
import { Button } from "@/components/ui/Button";
import { GitHubIcon } from "@/components/ui/GitHubIcon";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";
import { site } from "@/data/site";
import { isTodo } from "@/lib/utils";

/**
 * "Editorial + request trace". Inside the page container, from lg a 5fr / 7fr grid (`.layout-hero`);
 * below lg it stacks, text first. The left column is calm and unboxed;
 * the stage on the right is a glass panel with the exploded stack.
 */
export function Hero() {
  const { links, availability, hero, location } = site;
  const showLocation = location !== "" && !isTodo(location);

  return (
    <HeroState>
      <span aria-hidden="true" className="hero-field" />

      <div className="container-page layout-hero">
        {/* The size container: the name is sized from this column's width, not the viewport */}
        <div className="hero-text">
          <div className="hero-in hero-in-status flex flex-wrap items-center gap-x-4 gap-y-2">
            {availability.open ? (
              <p className="status-pill">
                <span aria-hidden="true" className="relative flex size-2">
                  <span className="absolute inline-flex size-full rounded-full bg-emerald-700 opacity-60 motion-safe:animate-ping dark:bg-emerald-300" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-700 dark:bg-emerald-300" />
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {availability.text}
                </span>
              </p>
            ) : null}
            {showLocation ? <p className="location-tag">{location}</p> : null}
          </div>

          <RoleBlock className="hero-in hero-in-role role-line mt-8 short:mt-5" />

          {/* Split into words and letters so the width axis can animate letter by letter */}
          <h1 id="hero-heading" className="type-hero mt-3 short:mt-2" aria-label={site.name}>
            {site.name.split(" ").map((word, wordIndex) => (
              <Fragment key={`${word}-${wordIndex}`}>
                {wordIndex > 0 ? " " : null}
                <span className="name-word block whitespace-nowrap" aria-hidden="true">
                  {[...word].map((letter, letterIndex) => (
                    <span key={letterIndex} className="name-letter">
                      {letter}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </h1>

          <p className="hero-in hero-in-statement type-statement mt-8 short:mt-5">
            {hero.statement.map((part, index) =>
              part.layer ? (
                <span key={index} data-layer={part.layer} className="layer-text">
                  {part.text}
                </span>
              ) : (
                <Fragment key={index}>{part.text}</Fragment>
              ),
            )}
          </p>

          <p className="hero-in hero-in-now type-body mt-6 text-neutral-600 dark:text-neutral-400 short:mt-3">
            {site.now}
          </p>

          <div className="hero-in hero-in-actions mt-8 short:mt-5">
            <div className="flex flex-wrap items-center gap-3">
              <Button href="#projects">
                {hero.seeWork}
                <ArrowDown aria-hidden="true" className="size-5" />
              </Button>
              <Button href="#contact" variant="secondary">
                {hero.getInTouch}
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 short:mt-3">
              {/* Only once site.ts points at a web-safe resume (no phone number or address) */}
              {!isTodo(links.resume) ? (
                <a href={links.resume} download className="quiet-link">
                  <FileDown aria-hidden="true" className="size-5" />
                  {hero.resumeLabel}
                </a>
              ) : null}
              {!isTodo(links.linkedin) ? (
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quiet-link"
                >
                  <LinkedInIcon outline />
                  {hero.linkedinLabel}
                </a>
              ) : null}
              {!isTodo(links.github) ? (
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quiet-link"
                >
                  <GitHubIcon outline />
                  {hero.githubLabel}
                </a>
              ) : null}
            </div>
          </div>

          <HeroFacts className="hero-in hero-in-facts facts mt-12 short:mt-6" />
        </div>

        <HeroStage />
      </div>
    </HeroState>
  );
}
