import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { BigEmail } from "@/components/BigEmail";
import { ContactStage } from "@/components/ContactStage";
import { ContactTraces } from "@/components/ContactTraces";
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
};

/** One full-width row. A channel that is still a TODO is a plain row (development only). */
function LinkRow({ channel }: { channel: Channel }) {
  const { layer, label, icon, href, external } = channel;
  const todo = isTodo(href);
  const content = (
    <>
      <span className="contact-icon">{icon}</span>
      <span className="grid min-w-0">
        <span className="type-small">{label}</span>
        <span className="contact-row-value">{todo ? href : channel.value}</span>
      </span>
      <span aria-hidden="true" className="contact-go">
        <ArrowRight className="size-5" />
      </span>
    </>
  );

  return (
    <li data-layer={layer}>
      {todo ? (
        <div className="contact-row">{content}</div>
      ) : (
        <a
          href={href}
          className="contact-row"
          {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {content}
        </a>
      )}
    </li>
  );
}

export function Contact() {
  const { links, availability, contact } = site;
  const showTodo = process.env.NODE_ENV !== "production";

  const channels = (
    [
      {
        layer: "application",
        label: contact.linkedinLabel,
        value: profileHandle(links.linkedin),
        icon: <LinkedInIcon className="size-5" />,
        href: links.linkedin,
        external: true,
      },
      {
        layer: "data",
        label: contact.githubLabel,
        value: profileHandle(links.github),
        icon: <GitHubIcon className="size-5" />,
        href: links.github,
        external: true,
      },
    ] satisfies Channel[]
  ).filter((channel) => showTodo || !isTodo(channel.href));

  const headline = contact.headline;

  return (
    <ContactStage id="contact" labelledBy="contact-heading">
      <div className="container-page">
        {availability.open ? (
          <p className="contact-status">
            <span aria-hidden="true" className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-emerald-700 opacity-60 motion-safe:animate-ping dark:bg-emerald-300" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-700 dark:bg-emerald-300" />
            </span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {availability.text}
            </span>
            <span className="hidden sm:inline">{contact.statusMore}</span>
          </p>
        ) : null}

        <h2 id="contact-heading" className="type-cta mt-6">
          <span className="cta-line1">{headline}</span>
        </h2>

        <p className="type-body mt-6 text-neutral-600 dark:text-neutral-400">{contact.lede}</p>

        <div className="mt-10 sm:mt-12">
          <BigEmail />
        </div>

        <ul className="contact-rows mt-10 sm:mt-12">
          {channels.map((channel) => (
            <LinkRow key={channel.label} channel={channel} />
          ))}
        </ul>

        <ContactTraces />
        <p className="type-small mt-2 flex flex-wrap justify-between gap-x-6 gap-y-1">
          <span>{contact.closing}</span>
          <span>{site.name}</span>
        </p>
      </div>
    </ContactStage>
  );
}
