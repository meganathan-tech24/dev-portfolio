import { site } from "@/data/site";
import { isTodo } from "@/lib/utils";

export function Footer() {
  const { links } = site;
  const items = [
    { label: "Email", href: `mailto:${links.email}`, external: false },
    { label: "LinkedIn", href: links.linkedin, external: true },
    { label: "GitHub", href: links.github, external: true },
    { label: "Resume", href: links.resume, external: false },
  ].filter((item) => !isTodo(item.href));

  return (
    <footer className="rule border-t py-8">
      <div className="container-page flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="type-small">
          © {new Date().getFullYear()} {site.name}
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {items.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="link"
                {...(item.external && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
