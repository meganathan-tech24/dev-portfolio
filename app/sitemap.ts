import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  // Sitemap URLs must be absolute, so there is nothing to list until site.siteUrl is set
  if (!base) return [];

  return [
    { url: new URL("/", base).href },
    ...projects.map((project) => ({
      url: new URL(`/projects/${project.slug}`, base).href,
    })),
  ];
}
