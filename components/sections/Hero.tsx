import { StackDiagram } from "@/components/StackDiagram";
import { Button } from "@/components/ui/Button";
import { site } from "@/data/site";
import { isTodo } from "@/lib/utils";

export function Hero() {
  const { links, availability } = site;
  const socials = [
    { label: "LinkedIn", href: links.linkedin },
    { label: "GitHub", href: links.github },
  ].filter((social) => !isTodo(social.href));

  return (
    <section aria-labelledby="hero-heading" className="section">
      <div className="container-page grid items-center gap-12 lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-3">
          <h1 id="hero-heading" className="type-hero">
            {site.name}
          </h1>
          <p className="type-h3 mt-4 text-neutral-600 dark:text-neutral-400">
            {site.role}
          </p>
          <p className="type-body mt-6">{site.tagline}</p>
          {availability.open ? (
            <p className="type-small mt-4">{availability.text}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#projects">See my work</Button>
            <Button href="#contact" variant="secondary">
              Get in touch
            </Button>
          </div>

          {socials.length > 0 ? (
            <ul className="mt-8 flex gap-6">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <StackDiagram className="w-full max-w-md lg:col-span-2 lg:justify-self-end" />
      </div>
    </section>
  );
}
