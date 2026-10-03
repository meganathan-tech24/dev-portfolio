import { FileDown, Mail } from "lucide-react";
import Link from "next/link";
import { BackToTopButton } from "@/components/BackToTopButton";
import { LayerShortcuts } from "@/components/LayerShortcuts";
import { GitHubIcon } from "@/components/ui/GitHubIcon";
import { LayerMark } from "@/components/ui/LayerMark";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";
import { TechIcon } from "@/components/ui/TechIcon";
import { skillGroups } from "@/data/skills";
import { site } from "@/data/site";
import { isTodo } from "@/lib/utils";

function ColumnHeading({ children }: { children: string }) {
  return <h2 className="font-display text-base font-semibold">{children}</h2>;
}

export function Footer() {
  const { links } = site;
  // Contact links with an icon; the ones that are still a TODO in site.ts are left out
  const contact = [
    {
      label: "Email",
      href: `mailto:${links.email}`,
      icon: <Mail aria-hidden="true" className="size-5" />,
      external: false,
      download: false,
    },
    {
      label: "LinkedIn",
      href: links.linkedin,
      icon: <LinkedInIcon />,
      external: true,
      download: false,
    },
    {
      label: "GitHub",
      href: links.github,
      icon: <GitHubIcon />,
      external: true,
      download: false,
    },
    {
      label: "Resume",
      href: links.resume,
      icon: <FileDown aria-hidden="true" className="size-5" />,
      external: false,
      download: true,
    },
  ].filter((item) => !isTodo(item.href));

  return (
    <footer className="relative">
      {/* A thin line in the four layer colours, between the page and the footer */}
      <div aria-hidden="true" className="flex h-0.5">
        {skillGroups.map((group) => (
          <span key={group.layer} data-layer={group.layer} className="layer-fill flex-1" />
        ))}
      </div>

      <div className="container-page grid gap-10 py-10 sm:py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="flex items-center gap-3 font-display text-base font-semibold">
              <LayerMark />
              {site.name}
            </p>
            <p className="type-small mt-3">{site.role}</p>
            {site.availability.open ? (
              <p className="type-small mt-1">{site.availability.text}</p>
            ) : null}
          </div>

          <nav aria-label="Footer: sections">
            <ColumnHeading>Sections</ColumnHeading>
            <ul className="mt-4 grid gap-2">
              {site.nav.map((item) => (
                <li key={item.id}>
                  <Link href={`/#${item.id}`} className="link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <ColumnHeading>Stack</ColumnHeading>
            <div className="mt-4">
              <LayerShortcuts />
            </div>
          </div>
        </div>

        {/* Icon-only links; the ones that are still a TODO in site.ts are left out */}
        <ul aria-label="Contact links" className="flex flex-wrap items-center gap-3">
          {contact.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                aria-label={item.label}
                className="btn btn-secondary btn-icon"
                {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                {...(item.download && { download: true })}
              >
                {item.icon}
              </a>
            </li>
          ))}
        </ul>

        <div className="rule flex flex-col gap-6 border-t pt-8 md:flex-row md:items-center md:justify-between">
          {/* The year is worked out on the server when the site is built, not in the browser */}
          <p className="type-small">
            © {new Date().getFullYear()} {site.name}
          </p>

          <p className="type-small flex flex-wrap items-center gap-x-2 gap-y-1">
            Built with
            {site.builtWith.map((tool, index) => (
              <span key={tool.name} className="inline-flex items-center gap-1.5">
                <TechIcon icon={tool.icon} layer="interface" />
                {tool.name}
                {index < site.builtWith.length - 2
                  ? ","
                  : index === site.builtWith.length - 2
                    ? " and"
                    : ""}
              </span>
            ))}
          </p>

          <BackToTopButton />
        </div>
      </div>
    </footer>
  );
}
