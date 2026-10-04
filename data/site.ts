import type { Site } from "./types";

export const site = {
  name: "Meganathan Palanisamy",
  role: "Senior full-stack developer",
  now: "Currently building Coheart, a learning platform for cohort-based programmes, with React, Node.js and PostgreSQL on Azure.",
  bio: [
    "I'm a full-stack developer who builds and ships web applications, from system design through to production.",
    "At Teckollab I work on Coheart, a multi-tenant learning platform: the React and TypeScript front end, the Node.js and Prisma back end, the PostgreSQL data design and the deployment pipeline. Before that I worked at App Innovation Technologies, building MERN-stack applications and mentoring junior developers.",
    // TODO: add a short paragraph on how I like to work (not in the resume)
    "TODO: add a short paragraph on how I like to work",
  ],
  photo: {
    src: "/images/Meganathan_Image.png",
    alt: "Meganathan Palanisamy",
    // intrinsic size of the file, so next/image can reserve the space
    width: 413,
    height: 472,
  },

  // TODO: confirm a city-level location to show publicly (see the resume); empty hides the hero tag
  location: "",
  availability: {
    // TODO: confirm wording (roles, freelance, remote, start date)
    text: "Open to full-stack roles",
    open: true,
  },
  links: {
    email: "meganathankpm220@gmail.com",
    linkedin: "https://www.linkedin.com/in/meganathan-tech-2k",
    // TODO: GitHub profile URL (not in the resume)
    github: "https://github.com/meganathan-tech24",
    // TODO: public/resume.pdf still contains phone and address. Replace it
    // with a web-safe version, then set this to "/resume.pdf"
    resume: "TODO: web-safe resume path",
  },
  siteUrl: "https://dev-portfolio-ashy-ten.vercel.app",
  hero: {
    statement: [
      { text: "I build multi-tenant products end to end, from the " },
      { text: "interface", layer: "interface" },
      { text: " to the " },
      { text: "infrastructure", layer: "infrastructure" },
      { text: "." },
    ],
    seeWork: "See my work",
    getInTouch: "Get in touch",
    resumeLabel: "Resume",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
    experienceLabel: "Experience",
    yearsUnit: "years",
    nowAtLabel: "Now at",
    latestLabel: "Latest build",
    caseStudy: "Read case study",
    stage: {
      trace: "trace",
      title: "Loading a cohort dashboard",
      request: "Request",
      response: "Response",
      layerWord: "Layer",
      ofWord: "of",
      pause: "Pause",
      play: "Play",
      hint: "Hover a layer to explore it",
    },
  },
  contact: {
    statusMore: "and freelance projects",
    headline: "Got something to build?",
    lede: "I build multi-tenant web apps and learning platforms with React, Next.js, Node.js and PostgreSQL. If you're hiring or have a product in mind, email me.",
    emailLabel: "Email, the fastest way to reach me",
    shortcutHint: "Press C",
    copyLabel: "Copy email",
    copiedLabel: "Copied",
    mailLabel: "Open in mail app",
    toastCopied: "Email copied. Talk soon.",
    toastFailed: "Could not copy. Use the mail app link instead.",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
    closing: "Interface, application, data, infrastructure. Built end to end.",
  },
  builtWith: [
    { name: "Next.js", icon: "nextjs" },
    { name: "Tailwind CSS", icon: "tailwind" },
    // simple-icons has no Motion logo, so this one shows a lucide icon
    { name: "Motion", icon: "motion" },
  ],
  nav: [
    { label: "Stack", id: "stack", mark: "all" },
    { label: "Projects", id: "projects", mark: "interface" },
    { label: "Experience", id: "experience", mark: "application" },
    { label: "About", id: "about", mark: "data" },
    { label: "Contact", id: "contact", mark: "infrastructure" },
  ],
  seo: {
    title: "Meganathan Palanisamy, full-stack developer",
    description:
      "Full-stack developer building multi-tenant web apps with React, Next.js, Node.js, PostgreSQL and TypeScript.",
    keywords: [
      "full-stack developer",
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "multi-tenant SaaS",
    ],
  },
} satisfies Site;
