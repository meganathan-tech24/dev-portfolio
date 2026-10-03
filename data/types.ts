/**
 * Shared types for every file in /data.
 *
 * Missing information is written as a string that starts with "TODO" so it
 * is easy to find (search for `TODO`) and never shown as real content.
 */

/** The four stack layers; matches the data-layer values in globals.css */
export type Layer = "interface" | "application" | "data" | "infrastructure";

/** A technology and the layer it belongs to (drives its colour) */
export type Tech = {
  name: string;
  layer: Layer;
};

export type Availability = {
  /** Short line shown in the hero and footer */
  text: string;
  /** Whether to show the availability line at all */
  open: boolean;
};

export type SiteLinks = {
  email: string;
  linkedin: string;
  github: string;
  /** Path to the web-safe resume in /public (no phone, no address) */
  resume: string;
};

export type NavItem = {
  label: string;
  /** id of the section on the home page, without the # */
  id: string;
};

export type Photo = {
  /** Path in /public, e.g. "/images/portrait.jpg" */
  src: string;
  alt: string;
  /** Intrinsic size in pixels, so next/image can reserve space */
  width: number;
  height: number;
};

export type Site = {
  name: string;
  role: string;
  /** One plain sentence about what I build (hero) */
  tagline: string;
  /** Short bio paragraphs (About) */
  bio: string[];
  /** Plain portrait for the About section */
  photo: Photo;
  /** City-level only */
  location: string;
  availability: Availability;
  links: SiteLinks;
  /** Production URL; used for metadataBase, canonical, sitemap and OG images */
  siteUrl: string;
  /** Navbar links, in page order */
  nav: NavItem[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};

export type SkillGroup = {
  layer: Layer;
  /** Display name of the layer */
  label: string;
  /** One plain sentence about what I do in this layer */
  summary: string;
  /** Ordered by importance: the first four also label the hero diagram */
  skills: string[];
};

export type ExperienceItem = {
  company: string;
  role: string;
  location: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM */
  end: string;
  highlights: string[];
  tech: Tech[];
};

export type EducationItem = {
  qualification: string;
  institution: string;
  /** Years, e.g. "2018" */
  start: string;
  end: string;
  grade?: string;
};

export type ProjectLinks = {
  live?: string;
  code?: string;
};

export type Screenshot = {
  /** Path in /public, e.g. "/images/coheart-dashboard.png" */
  src: string;
  alt: string;
  /** Intrinsic size in pixels, so next/image can reserve space */
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  title: string;
  /** One line for lists and cards */
  summary: string;
  featured: boolean;
  /** Employer the work was done for */
  company: string;
  problem: string;
  built: string[];
  role: string;
  stack: Tech[];
  challenges: string;
  outcome: string;
  links: ProjectLinks;
  screenshots: Screenshot[];
};
