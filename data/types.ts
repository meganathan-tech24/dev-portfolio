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

/** A piece of the hero statement; a part with a layer is set in that layer's colour */
export type StatementPart = {
  text: string;
  layer?: Layer;
};

/** Text of the hero's stage panel (the stack and its layer cards) */
export type StageCopy = {
  /** Mono label before the trace title */
  trace: string;
  /** What the request in the trace is doing */
  title: string;
  request: string;
  response: string;
  /** "Layer" and "of" around the step numbers: "Layer 2 of 4" */
  layerWord: string;
  ofWord: string;
  pause: string;
  play: string;
  /** Under the stack, on devices with hover */
  hint: string;
};

export type HeroCopy = {
  /** The line under the name, split so a word can take its layer colour */
  statement: StatementPart[];
  seeWork: string;
  getInTouch: string;
  /** Quiet links under the buttons; the resume one only shows once the web-safe resume path is set */
  resumeLabel: string;
  linkedinLabel: string;
  githubLabel: string;
  /** Facts row labels */
  experienceLabel: string;
  yearsUnit: string;
  nowAtLabel: string;
  latestLabel: string;
  caseStudy: string;
  stage: StageCopy;
};

export type ContactCopy = {
  /** Second part of the status pill, hidden on small screens (after the availability text) */
  statusMore: string;
  /** The two lines of the headline */
  headline: string;
  lede: string;
  emailLabel: string;
  shortcutHint: string;
  copyLabel: string;
  copiedLabel: string;
  mailLabel: string;
  toastCopied: string;
  toastFailed: string;
  /** Labels of the link rows */
  linkedinLabel: string;
  githubLabel: string;
  /** Line under the traces at the bottom of the section */
  closing: string;
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
  /**
   * The section's colour in the header: its underline, the lit segment of the layer strip and
   * the marker in the mobile menu. A layer, or "all" for the whole strip. Sections without
   * one use the interface colour (sky).
   */
  mark?: Layer | "all";
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
  /** What I am building now, one line (hero) */
  now: string;
  /** Short bio paragraphs (About) */
  bio: string[];
  /** Plain portrait for the About section */
  photo: Photo;
  /** City-level only. Empty until I confirm one; the hero tag is hidden while it is empty */
  location: string;
  availability: Availability;
  links: SiteLinks;
  /** Production URL; used for metadataBase, canonical, sitemap and OG images */
  siteUrl: string;
  /** Navbar links, in page order */
  nav: NavItem[];
  /** Text of the hero that is not data from elsewhere */
  hero: HeroCopy;
  /** All text of the "Get in touch" section */
  contact: ContactCopy;
  /** What this site is built with, shown as small logos in the footer */
  builtWith: Skill[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};

/**
 * Which logo a technology shows. Most are simple-icons logos (TechIcon maps them); azure,
 * openai and mux are not in simple-icons and use a lucide icon; "layer" means no logo
 * exists, so the badge shows the icon of its stack layer.
 */
export type IconKey =
  | "react"
  | "nextjs"
  | "typescript"
  | "tailwind"
  | "redux"
  | "javascript"
  | "nodejs"
  | "express"
  | "prisma"
  | "laravel"
  | "zoom"
  | "whatsapp"
  | "campaignmonitor"
  | "openai"
  | "mux"
  | "postgresql"
  | "mongodb"
  | "redis"
  | "mysql"
  | "azure"
  | "githubactions"
  | "git"
  | "postman"
  | "make"
  | "motion"
  | "layer";

export type Skill = {
  name: string;
  icon: IconKey;
};

export type SkillGroup = {
  layer: Layer;
  /** Display name of the layer */
  label: string;
  /** One plain sentence about what I do in this layer */
  summary: string;
  /** What this layer does in the hero's request trace ("Loading a cohort dashboard") */
  requestStep: string;
  /** Ordered by importance: the first four are named on the hero's layer cards */
  skills: Skill[];
};

export type ExperienceItem = {
  company: string;
  role: string;
  location: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM, or "present" for a job I still have (resolved to the build month) */
  end: string;
  highlights: string[];
  tech: Tech[];
};

export type EducationItem = {
  /** Degree and field, e.g. "Bachelor of Science (BS), Computer Science" */
  qualification: string;
  institution: string;
  /** Town or city, if the resume gives one */
  location?: string;
  /** Years, e.g. "2018" */
  start: string;
  end: string;
  grade?: string;
  /** Only what the resume lists; each is skipped when absent */
  coursework?: string[];
  project?: string;
  certifications?: string[];
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

/** One file of a project logo */
export type LogoImage = {
  /** Path in /public, e.g. "/images/stepzero.light-logo.png" */
  src: string;
  /** Intrinsic size in pixels, so next/image can reserve space */
  width: number;
  height: number;
};

export type ProjectLogo = {
  alt: string;
  /** For the light theme (and for both themes when there is no `dark` version) */
  light: LogoImage;
  /** A version for the dark theme, if the logo needs one */
  dark?: LogoImage;
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
  /** Shown in the screenshot frame until there is a real screenshot */
  logo?: ProjectLogo;
  screenshots: Screenshot[];
};
