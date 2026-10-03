import { FileDown, Mail } from "lucide-react";
import type { ReactNode } from "react";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { BorderFlowRing } from "@/components/ui/BorderFlowRing";
import { Button } from "@/components/ui/Button";
import { GitHubIcon } from "@/components/ui/GitHubIcon";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";
import { site } from "@/data/site";
import type { Layer } from "@/data/types";
import { isTodo, profileHandle } from "@/lib/utils";

type Channel = {
  layer: Layer;
  label: string;
  value: string;
  icon: ReactNode;
  href: string;
  external?: boolean;
  download?: boolean;
};

/** One row of the contact stack: icon, label and value, all inside one link */
function ChannelRow({ channel }: { channel: Channel }) {
  const { layer, label, icon, href, external, download } = channel;
  const todo = isTodo(href);
  // a channel that is still a TODO shows that note instead of its value (development only)
  const value = todo ? href : channel.value;
  const content = (
    <>
      <span className="contact-icon">{icon}</span>
      <span className="grid min-w-0">
        <span className="type-small">{label}</span>
        <span className="font-display text-lg font-semibold wrap-anywhere sm:text-xl">{value}</span>
      </span>
    </>
  );

  return (
    <li data-layer={layer}>
      {todo ? (
        // Only reached in development: production builds leave unfinished channels out
        <div className="contact-row">{content}</div>
      ) : (
        <a
          href={href}
          className="contact-row"
          download={download}
          {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {content}
        </a>
      )}
    </li>
  );
}

export function Contact() {
  const { links, availability } = site;
  const showTodo = process.env.NODE_ENV !== "production";

  const channels = (
    [
      {
        layer: "application",
        label: "LinkedIn",
        value: profileHandle(links.linkedin),
        icon: <LinkedInIcon />,
        href: links.linkedin,
        external: true,
      },
      {
        layer: "data",
        label: "GitHub",
        value: profileHandle(links.github),
        icon: <GitHubIcon />,
        href: links.github,
        external: true,
      },
      {
        layer: "infrastructure",
        label: "Resume",
        value: "PDF",
        icon: <FileDown aria-hidden="true" className="size-5" />,
        href: links.resume,
        download: true,
      },
    ] satisfies Channel[]
  ).filter((channel) => showTodo || !isTodo(channel.href));

  return (
    <section id="contact" aria-labelledby="contact-heading" className="section section-alt">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div data-reveal="fade">
          <h2 id="contact-heading" className="type-h2">
            Get in touch
          </h2>
          <p className="type-body mt-4 text-neutral-600 dark:text-neutral-400">
            {site.contactIntro}
          </p>
          {availability.open ? (
            <p className="mt-6 flex items-center gap-3 font-display text-base font-medium">
              <span aria-hidden="true" className="relative flex size-2.5">
                <span className="absolute inline-flex size-full rounded-full bg-emerald-700 opacity-60 motion-safe:animate-ping dark:bg-emerald-300" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-700 dark:bg-emerald-300" />
              </span>
              {availability.text}
            </p>
          ) : null}
        </div>

        {/* The contact stack: one glass panel, one row per channel, each in a layer colour.
            The icons are decorative: every row has a text label. */}
        <div data-reveal="fade" className="border-flow glass @container overflow-hidden rounded-lg">
          <BorderFlowRing />
          <ul className="contact-stack">
            <li data-layer="interface">
              <div className="contact-row contact-row-email">
                <span className="contact-icon">
                  <Mail aria-hidden="true" className="size-5" />
                </span>
                <span className="grid min-w-0">
                  <span className="type-small">Email</span>
                  <span className="font-display text-base font-semibold wrap-anywhere select-all sm:text-xl">
                    {links.email}
                  </span>
                </span>
                <span className="contact-actions">
                  <CopyEmailButton email={links.email} className="btn-sm" />
                  <Button href={`mailto:${links.email}`} className="btn-sm">
                    Send email
                  </Button>
                </span>
              </div>
            </li>
            {channels.map((channel) => (
              <ChannelRow key={channel.label} channel={channel} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
