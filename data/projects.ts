import type { Project } from "./types";

/**
 * Add a project by adding one object here; its case-study page at
 * /projects/[slug] is generated from it.
 *
 * The resume gives what each project is, what I built and the tech. It does
 * not give challenges, outcomes, links or screenshots, so those are TODOs.
 */
export const projects = [
  {
    slug: "coheart",
    title: "Coheart",
    summary:
      "A multi-tenant learning platform for cohort-based programmes: scheduling, attendance, analytics and communication.",
    featured: true,
    company: "Teckollab",
    // TODO: confirm in your own words what problem Coheart solves for its customers
    problem:
      "Cohort-based programmes need one place to manage programmes, scheduling, attendance, analytics and communication, for several organisations on shared infrastructure.",
    built: [
      "Full-stack features end to end with React, TypeScript, Node.js and PostgreSQL.",
      "The database design and APIs behind organisations, programmes, cohorts and learners, with tenant isolation between organisations.",
      "Analytics dashboards that show teams how a programme and its learners are doing.",
      "Integrations with video conferencing and automation tools.",
      "Ongoing performance, reliability and user-experience work, and production support.",
    ],
    role: "Full-stack developer and architect at Teckollab. I own features from requirements through implementation to deployment.",
    stack: [
      { name: "React", layer: "interface" },
      { name: "TypeScript", layer: "interface" },
      { name: "Tailwind CSS", layer: "interface" },
      { name: "Node.js", layer: "application" },
      { name: "Express", layer: "application" },
      { name: "Prisma", layer: "application" },
      { name: "REST APIs", layer: "application" },
      { name: "PostgreSQL", layer: "data" },
      { name: "Azure", layer: "infrastructure" },
      { name: "Git", layer: "infrastructure" },
    ],
    // TODO: one or two real technical challenges (for example tenant isolation)
    challenges: "TODO: describe the main challenges",
    // TODO: real outcome only (users, organisations, results you can state); no invented numbers
    outcome: "TODO: describe the outcome",
    links: {
      // TODO: live URL (the resume title links to LinkedIn, not the site)
      // TODO: code link, if any (probably private client work)
    },
    logo: {
      alt: "Coheart logo",
      light: { src: "/images/coheart.light.png", width: 191, height: 43 },
      dark: { src: "/images/coheart.dark.png", width: 191, height: 43 },
    },
    // TODO: real screenshots in /public/images, with alt text
    screenshots: [],
  },
  {
    slug: "culture-labs",
    title: "Culture Labs",
    summary:
      "An e-learning and employee engagement platform with courses, quizzes, assessments and learner analytics.",
    featured: false,
    company: "Teckollab",
    // TODO: confirm the problem it solves in your own words
    problem:
      "An e-learning platform for course management, assessments, learner progress and analytics.",
    built: [
      "Full-stack features with React, TypeScript, Node.js and PostgreSQL.",
      "Course, quiz and assessment workflows that deliver content and track learners.",
      "Analytics dashboards for learner engagement and course performance.",
      "Secure, protected video streaming for course content with Mux.",
      "Ongoing performance, reliability and user-experience work, and production support.",
    ],
    role: "Full-stack developer at Teckollab, across the full development cycle from requirements to production support.",
    stack: [
      { name: "React", layer: "interface" },
      { name: "TypeScript", layer: "interface" },
      { name: "Tailwind CSS", layer: "interface" },
      { name: "Node.js", layer: "application" },
      { name: "Express", layer: "application" },
      { name: "Prisma", layer: "application" },
      { name: "REST APIs", layer: "application" },
      { name: "Mux", layer: "application" },
      { name: "PostgreSQL", layer: "data" },
      { name: "Azure", layer: "infrastructure" },
      { name: "Git", layer: "infrastructure" },
    ],
    challenges: "TODO: describe the main challenges",
    outcome: "TODO: describe the outcome",
    links: {
      // TODO: live URL, code link
    },
    logo: {
      alt: "Culture Labs logo",
      light: { src: "/images/culture_labs.png", width: 1079, height: 376 },
    },
    // TODO: real screenshots
    screenshots: [],
  },
  {
    slug: "stepzero",
    title: "StepZero.eco",
    summary:
      "A sustainability platform that helps businesses assess their practices and get an improvement plan.",
    featured: false,
    company: "Teckollab",
    problem:
      "Businesses need a way to assess their sustainability practices and turn the result into actionable improvements.",
    built: [
      "Full-stack features end to end with React, Next.js, TypeScript, Node.js and PostgreSQL.",
      "Onboarding workflows that capture a business profile, its sustainability goals and its current practices.",
      "OpenAI-generated sustainability recommendations and actionable checklists.",
      "Responsive interfaces with React and Tailwind CSS.",
      "Ongoing performance, reliability and user-experience work.",
    ],
    role: "Full-stack developer at Teckollab.",
    stack: [
      { name: "React", layer: "interface" },
      { name: "Next.js", layer: "interface" },
      { name: "TypeScript", layer: "interface" },
      { name: "Tailwind CSS", layer: "interface" },
      { name: "Node.js", layer: "application" },
      { name: "REST APIs", layer: "application" },
      { name: "OpenAI API", layer: "application" },
      { name: "PostgreSQL", layer: "data" },
      { name: "Azure", layer: "infrastructure" },
      { name: "Git", layer: "infrastructure" },
    ],
    challenges: "TODO: describe the main challenges",
    outcome: "TODO: describe the outcome",
    links: {
      // TODO: live URL (stepzero.eco?), code link
    },
    logo: {
      alt: "StepZero.eco logo",
      light: { src: "/images/stepzero.light-logo.png", width: 656, height: 160 },
      dark: { src: "/images/stepzero.dark-logo.png", width: 652, height: 160 },
    },
    // TODO: real screenshots
    screenshots: [],
  },
  {
    slug: "footprints-cdp",
    title: "Footprints CDP",
    summary: "A retail analytics and customer data platform for shopping malls and retailers.",
    featured: false,
    company: "App Innovation Technologies",
    problem:
      "Shopping malls and retailers need analytics and customer data across retail, campaigns, sales and digital signage.",
    built: [
      "Maintained and extended the apps built with React, Node.js, Express, Laravel, MongoDB and MySQL.",
      "Improvements to the Retail Analytics, Campaign Management, Sales and Digital Signage modules.",
      "REST API, database workflow and third-party integration improvements, including Facebook Ads, Google Ads and email platforms.",
      "Troubleshooting across the front end, back end, APIs, database and production.",
    ],
    role: "Developer at App Innovation Technologies, on maintenance, feature work, performance and production support.",
    stack: [
      { name: "React", layer: "interface" },
      { name: "JavaScript", layer: "interface" },
      { name: "Node.js", layer: "application" },
      { name: "Express", layer: "application" },
      { name: "Laravel", layer: "application" },
      { name: "REST APIs", layer: "application" },
      { name: "MongoDB", layer: "data" },
      { name: "MySQL", layer: "data" },
      { name: "Git", layer: "infrastructure" },
    ],
    challenges: "TODO: describe the main challenges",
    outcome: "TODO: describe the outcome",
    links: {
      // TODO: live URL, code link
    },
    logo: {
      alt: "Footprints CDP logo",
      light: { src: "/images/footprints-cdp.jpeg", width: 159, height: 148 },
    },
    // TODO: real screenshots
    screenshots: [],
  },
] satisfies Project[];
