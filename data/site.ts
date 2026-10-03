import type { Site } from "./types";

export const site = {
  name: "Meganathan Palanisamy",
  role: "Senior full-stack developer",
  tagline:
    "I build multi-tenant web apps and learning platforms with React, Next.js, Node.js and PostgreSQL.",
  bio: [
    "I'm a full-stack developer who builds and ships web applications, from system design through to production.",
    "At Teckollab I work on Coheart, a multi-tenant learning platform: the React and TypeScript front end, the Node.js and Prisma back end, the PostgreSQL data design and the deployment pipeline. Before that I worked at App Innovation Technologies, building MERN-stack applications and mentoring junior developers.",
    // TODO: add a short paragraph on how I like to work (not in the resume)
    "TODO: add a short paragraph on how I like to work",
  ],
  photo: {
    // TODO: add a plain portrait to /public/images, then set src, width and height
    src: "TODO: /images/portrait.jpg",
    alt: "Portrait of Meganathan Palanisamy",
    width: 800,
    height: 1000,
  },

  // TODO: confirm a city-level location to show publicly (see the resume)
  location: "TODO: confirm city-level location",
  availability: {
    // TODO: confirm wording (roles, freelance, remote, start date)
    text: "Open to full-stack roles",
    open: true,
  },
  links: {
    email: "meganathankpm220@gmail.com",
    linkedin: "https://www.linkedin.com/in/meganathantech-2k",
    // TODO: GitHub profile URL (not in the resume)
    github: "TODO: GitHub profile URL",
    // TODO: public/resume.pdf still contains phone and address. Replace it
    // with a web-safe version, then set this to "/resume.pdf"
    resume: "TODO: web-safe resume path",
  },
  // TODO: production URL once there is a domain
  siteUrl: "TODO: production URL",
  nav: [
    { label: "Stack", id: "stack" },
    { label: "Projects", id: "projects" },
    { label: "Experience", id: "experience" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
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
