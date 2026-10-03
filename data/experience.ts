import type { EducationItem, ExperienceItem } from "./types";

/** Newest first */
export const experience = [
  {
    company: "Teckollab",
    role: "Full Stack Developer",
    location: "Swindon, UK (Remote)",
    start: "2025-04",
    // TODO: confirm. The resume says "Sep 2026" but also describes the role in
    // the present tense. If it is current, the timeline should show "Present".
    end: "2026-09",
    highlights: [
      "Architect and build Coheart, a multi-tenant, cohort-based learning management system, with React and TypeScript on the front end and Node.js, Express and Prisma on the back end.",
      "Designed the multi-tenant PostgreSQL data model and the tenant-isolation pattern that lets several organisations share one infrastructure.",
      "Set frontend architecture standards and a modular backend service design.",
      "Use SSR and SSG in Next.js, with SEO work, for search visibility and load performance.",
      "Integrated Mux, Zoom and Ayrshare for media streaming, real-time video and automated social publishing.",
      // TODO: the resume names the client (ANI); confirm before naming it publicly
      "Refactored the security of a client's enterprise .NET project, analysing the legacy codebase to modernise its architecture and meet enterprise security standards.",
      "Automated delivery with GitHub Actions and Prisma migrations, and deploy to Azure App Service.",
      "Brought GitHub Copilot and Claude into the development workflow for code generation, refactoring, debugging and reviews, which reduced repetitive development effort by 50%.",
    ],
    tech: [
      { name: "React", layer: "interface" },
      { name: "Next.js", layer: "interface" },
      { name: "TypeScript", layer: "interface" },
      { name: "Node.js", layer: "application" },
      { name: "Express", layer: "application" },
      { name: "Prisma", layer: "application" },
      { name: "Mux", layer: "application" },
      { name: "Zoom API", layer: "application" },
      { name: "Ayrshare", layer: "application" },
      { name: "PostgreSQL", layer: "data" },
      { name: "GitHub Actions", layer: "infrastructure" },
      { name: "Azure App Service", layer: "infrastructure" },
    ],
  },
  {
    company: "App Innovation Technologies",
    role: "Web Developer",
    location: "Coimbatore, India",
    start: "2022-04",
    end: "2025-04",
    highlights: [
      "Gathered client requirements and designed solution modules around project goals.",
      "Built reusable, modular components and held the team to code-quality standards.",
      "Refactored React components and state management across MERN-stack apps, improving performance and load speed by up to 25%.",
      "Added Redis caching and queue-based processing to reduce database query latency and keep apps stable under heavy traffic.",
      "Built marketing integrations: CampaignMonitor for email, plus Meta/Facebook, WhatsApp Business, MagicInfo and LG Digital Signage APIs, for multi-channel customer engagement.",
      "Automated deployments with GitHub Actions CI/CD, with automated quality checks.",
      "Mentored 2–3 junior developers through code reviews and pair programming, and the team delivered every Agile sprint on time.",
    ],
    tech: [
      { name: "React", layer: "interface" },
      { name: "Node.js", layer: "application" },
      { name: "Express", layer: "application" },
      { name: "CampaignMonitor", layer: "application" },
      { name: "WhatsApp Business", layer: "application" },
      { name: "MongoDB", layer: "data" },
      { name: "Redis", layer: "data" },
      { name: "GitHub Actions", layer: "infrastructure" },
    ],
  },
] satisfies ExperienceItem[];

/** Newest first */
export const education = [
  {
    qualification: "Bachelor of Science, Computer Science",
    institution: "Gobi Arts and Science College, Gobichettipalayam",
    start: "2018",
    end: "2021",
  },
  {
    qualification: "HSC, Computer Science",
    institution: "MPD Govt Hr Sec School",
    start: "2016",
    end: "2018",
    grade: "68.33%",
  },
  {
    qualification: "SSLC",
    institution: "MPD Govt Hr Sec School",
    start: "2014",
    end: "2016",
    grade: "86.8%",
  },
] satisfies EducationItem[];
