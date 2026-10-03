import type { SkillGroup } from "./types";

/** Top to bottom, the same order as the stack diagram */
export const skillGroups = [
  {
    layer: "interface",
    label: "Interface",
    summary:
      "I build React and Next.js interfaces in TypeScript, with server rendering and SEO work where search matters.",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Redux",
      "SSR and SSG",
      "SEO",
    ],
  },
  {
    layer: "application",
    label: "Application",
    summary:
      "I write Node.js and Express APIs with Prisma, and connect them to services such as Mux, Zoom and OpenAI.",
    skills: [
      "Node.js",
      "Express",
      "Prisma",
      "REST APIs",
      "Microservices",
      "Laravel",
      "Mux",
      "Zoom API",
      "Ayrshare",
      "OpenAI API",
      "CampaignMonitor",
      "WhatsApp Business",
    ],
  },
  {
    layer: "data",
    label: "Data",
    summary:
      "I design PostgreSQL schemas, including tenant isolation for multi-tenant apps, and use Redis for caching and queues.",
    skills: [
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "MySQL",
      "Multi-tenant data design",
    ],
  },
  {
    layer: "infrastructure",
    label: "Infrastructure",
    summary:
      "I deploy to Azure App Service and automate builds and Prisma migrations with GitHub Actions.",
    skills: [
      "Azure App Service",
      "GitHub Actions",
      "Git",
      "Postman",
      "Make.com",
    ],
  },
] satisfies SkillGroup[];
