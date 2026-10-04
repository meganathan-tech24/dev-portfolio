import type { Skill, SkillGroup } from "./types";

/**
 * Top to bottom, the same order as the stack diagram. Each skill has an `icon` key that
 * TechIcon turns into a logo; "layer" means there is no logo, so the layer's icon is shown.
 */
export const skillGroups = [
  {
    layer: "interface",
    label: "Interface",
    requestStep: "React renders the dashboard",
    summary:
      "I build React and Next.js interfaces in TypeScript, with server rendering and SEO work where search matters.",
    skills: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "Redux", icon: "redux" },
      { name: "SSR and SSG", icon: "layer" },
      { name: "SEO", icon: "layer" },
    ],
  },
  {
    layer: "application",
    label: "Application",
    requestStep: "Express API checks the tenant",
    summary:
      "I write Node.js and Express APIs with Prisma, and connect them to services such as Mux, Zoom and OpenAI.",
    skills: [
      { name: "Node.js", icon: "nodejs" },
      { name: "Express", icon: "express" },
      { name: "Prisma", icon: "prisma" },
      { name: "REST APIs", icon: "layer" },
      { name: "Microservices", icon: "layer" },
      { name: "Laravel", icon: "laravel" },
      { name: "Mux", icon: "mux" },
      { name: "Zoom API", icon: "zoom" },
      { name: "Ayrshare", icon: "layer" },
      { name: "OpenAI API", icon: "openai" },
      { name: "CampaignMonitor", icon: "campaignmonitor" },
      { name: "WhatsApp Business", icon: "whatsapp" },
    ],
  },
  {
    layer: "data",
    label: "Data",
    requestStep: "Prisma reads the cohort from PostgreSQL",
    summary:
      "I design PostgreSQL schemas, including tenant isolation for multi-tenant apps, and use Redis for caching and queues.",
    skills: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Redis", icon: "redis" },
      { name: "MySQL", icon: "mysql" },
      { name: "Multi-tenant data design", icon: "layer" },
    ],
  },
  {
    layer: "infrastructure",
    label: "Infrastructure",
    requestStep: "Runs on Azure, shipped by GitHub Actions",
    summary:
      "I deploy to Azure App Service and automate builds and Prisma migrations with GitHub Actions.",
    skills: [
      { name: "Azure App Service", icon: "azure" },
      { name: "GitHub Actions", icon: "githubactions" },
      { name: "Git", icon: "git" },
      { name: "Postman", icon: "postman" },
      { name: "Make.com", icon: "make" },
    ],
  },
] satisfies SkillGroup[];

/**
 * Technologies that appear in projects or jobs but not in the Stack bands, so they need an
 * icon key of their own. Look up any technology's icon with iconKeyFor (lib/tech.ts).
 */
export const otherTech = [
  { name: "JavaScript", icon: "javascript" },
  { name: "Azure", icon: "azure" },
] satisfies Skill[];
