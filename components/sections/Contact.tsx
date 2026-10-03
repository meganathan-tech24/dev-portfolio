import { CopyEmailButton } from "@/components/CopyEmailButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/data/site";
import { isTodo } from "@/lib/utils";

export function Contact() {
  const { links, availability } = site;
  const others = [
    { label: "LinkedIn", href: links.linkedin, external: true },
    { label: "GitHub", href: links.github, external: true },
    { label: "Download resume", href: links.resume, external: false },
  ].filter((item) => !isTodo(item.href));

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="section section-alt"
    >
      <div className="container-page">
        <SectionHeading
          id="contact-heading"
          description={
            availability.open
              ? `${availability.text}. The quickest way to reach me is email.`
              : "The quickest way to reach me is email."
          }
        >
          Contact
        </SectionHeading>

        <p className="font-display text-xl font-bold wrap-anywhere select-all sm:text-3xl lg:text-4xl">
          {links.email}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <CopyEmailButton email={links.email} />
        </div>

        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          <li>
            <a href={`mailto:${links.email}`} className="link">
              Send an email
            </a>
          </li>
          {others.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="link"
                {...(item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : { download: true })}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
