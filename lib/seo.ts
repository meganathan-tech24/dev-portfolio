import type { Metadata } from "next";
import { site } from "@/data/site";
import { isTodo } from "@/lib/utils";

/** The production URL, or undefined while site.siteUrl is still a TODO */
export function getSiteUrl() {
  return isTodo(site.siteUrl) ? undefined : new URL(site.siteUrl);
}

/** Canonical URL for a path; omitted until there is a real domain to resolve it against */
export function canonical(path: string): Metadata["alternates"] {
  return getSiteUrl() ? { canonical: path } : undefined;
}

/** schema.org Person for the whole site; TODO values are left out */
export function personJsonLd() {
  const url = getSiteUrl();
  const sameAs = [site.links.linkedin, site.links.github].filter(
    (link) => !isTodo(link),
  );

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    ...(url && { url: url.href }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}
