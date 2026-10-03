
# Dev Portfolio

## Goal
Personal portfolio for Meganathan Palanisamy, a full-stack developer.
Main audience: recruiters and hiring managers for full-stack roles, then
freelance clients. In under 30 seconds they should know what I build, which
stack I use, proof that I can ship, and how to contact me.
Fast, accessible, easy to update, and clearly made by a person, not a template.

## Tech stack (latest stable, checked 2026-10-03)
| Package | Version | Purpose |
| --- | --- | --- |
| `next` | 16.3.x | App Router, static rendering |
| `react`, `react-dom` | 19.3.x | |
| `typescript` | 7.0.x | strict mode (see version notes) |
| `tailwindcss`, `@tailwindcss/postcss` | 4.3.x | CSS-first config with `@theme` |
| `motion` | 14.x | animations; import from `motion/react` (not `framer-motion`) |
| `lucide-react` | 1.x | UI icons |
| `next-themes` | 0.4.x | light/dark mode |
| `clsx`, `tailwind-merge` | 2.x, 3.x | `cn()` helper in `lib/utils.ts` |
| `eslint`, `eslint-config-next` | 10.x, 16.3.x | linting |
| `prettier`, `prettier-plugin-tailwindcss` | 3.x, 0.8.x | formatting + class sorting |
| `@playwright/test`, `@axe-core/playwright` | 1.63.x, 4.13.x | smoke + accessibility tests |
| `@lhci/cli` | 0.15.x | Lighthouse CI |

- Content lives in typed TypeScript data files in `/data` (no MDX, no database)
- Fully static site: no API routes, no backend, no database, no contact form

### Version notes
- These versions are a snapshot. Before installing anything, run
  `npm view <pkg> version` and use whatever is current
- TypeScript 7 is the native (Go) compiler. If `next build`, `eslint-config-next`
  or typescript-eslint do not support it yet, use the newest TypeScript version
  they do support and tell me
- If `eslint-config-next` does not support the latest ESLint major yet, keep
  the ESLint version `create-next-app` installs and tell me
- Next.js 16: the `lint` script runs `eslint` directly (`next lint` is gone),
  and Turbopack is the default bundler. Confirm against the installed docs
- Tailwind 4: no `tailwind.config.js`; config is `@import "tailwindcss"` plus
  `@theme`, `@custom-variant` and `@utility` in `globals.css`. Gradients are
  `bg-linear-to-r` (not `bg-gradient-to-r`)

## Folder structure
```
/app
  layout.tsx            # fonts, metadata, theme provider, JSON-LD
  globals.css           # Tailwind import, theme, global classes
  page.tsx              # single-page sections
  not-found.tsx
  error.tsx
  sitemap.ts
  robots.ts
  opengraph-image.tsx
  /projects/[slug]
    page.tsx            # case-study page per project (generateStaticParams)
/components
  /sections             # Hero, About, Stack, Projects, Experience, Contact
  /ui                   # Button, Badge, SectionHeading, Reveal, ThemeToggle
  StackDiagram.tsx      # the signature visual (see Design)
/data
  types.ts              # shared types for all data files
  site.ts               # name, role, links, availability, SEO defaults
  skills.ts
  projects.ts
  experience.ts
/lib
  utils.ts              # cn() helper
/tests
  smoke.spec.ts         # Playwright + axe
/public
  resume.pdf            # web-safe resume (no phone, no address)
  images, favicon
/.github/workflows
  ci.yml                # lint, type check, build, Playwright, Lighthouse CI
```

## Sections
1. Navbar: name, section links, theme toggle, mobile menu
2. Hero: who I am, what I build, availability, two CTAs (See my work, Get in touch),
   and the stack diagram
3. Stack: my skills shown as layers of a real system (see Design)
4. Projects: one featured case study, then the rest; each links to its own page
5. Experience: timeline (Teckollab, App Innovation Technologies) and education
6. About: short bio, photo, how I like to work
7. Contact: email (mailto + copy button), LinkedIn, GitHub, Resume download
8. Footer: links and copyright year

## Source content (resume)
- My resume is in `/docs/` (`resume.md` or `resume.pdf`). It is the source of
  truth for all personal content
- Populate the `/data` files from it: name, role, bio, skills, jobs, education, projects
- Do not invent or exaggerate anything: no fake metrics, testimonials, client
  names or project numbers. If something is missing (links, screenshots,
  outcomes), leave a clearly marked `TODO` and tell me
- Rewrite resume bullets into short, plain portfolio copy, but keep facts,
  dates and employer names exactly as in the resume
- Public contact details are only those I approve: email, LinkedIn, GitHub,
  and a city-level location if I confirm it. Never copy my phone number or
  home address anywhere
- `/docs/` is reference only: never import it into the app or expose it in `/public`
- `/docs/` must be in `.gitignore` (the private resume has my phone and address)
- `/public/resume.pdf` must be a web-safe version without phone or address.
  If it still contains them, stop and tell me before using it

## Content rules
- All content comes from `/data`, never hardcoded inside components
- Every data file uses types from `/data/types.ts` and `satisfies` for checking
- Adding a project means adding one object to `projects.ts`; its case-study
  page is generated automatically
- No lorem ipsum; use clearly marked `TODO` placeholders
- Project data: problem, what I built, my role, stack, challenges, outcome,
  links, screenshots, `featured: boolean`
- `site.ts` includes `availability` (e.g. open to full-stack roles) and
  `siteUrl` (`TODO` until I have a domain; used for `metadataBase`, canonical,
  sitemap and OG images)
- Numbers shown on the site (years of experience etc.) are computed from
  `/data` at build time, never typed by hand

## Writing style (site copy)
- Plain, specific, first person. Say what I built and for whom, not adjectives
  ("I build booking and inventory systems with Next.js and Node", not
  "passionate developer crafting digital experiences")
- Sentence case everywhere; no all-caps labels
- Buttons say exactly what happens: "Download resume", "Copy email", "View code"
- No arrows appended to links or buttons, no emoji, no buzzwords
  ("passionate", "seamless", "cutting-edge", "pixel-perfect", "crafting")

## Design

### Direction: "Built in layers"
I am a full-stack developer, so the page is organised around the thing I
actually work on: a system's layers, from the interface down to the
infrastructure. The idea shows up in one strong place (the stack diagram and
Stack section) and everything else stays quiet, readable and well-typeset.

The goal is a site that looks designed for me, not like a generated template.

### Avoid (these make a portfolio look AI-generated)
- Blurred gradient blobs, glowing orbs, rainbow or spectrum gradients
- Glassmorphism cards (translucent + backdrop blur) everywhere
- Typewriter or rotating role text, floating tech icons, logo marquees
- Animated stat counters ("5+ years · 20+ projects")
- Gradient-ring avatar in the hero
- Every section fading and sliding up as you scroll; hover glow/tilt on every card
- One highlighted gradient word in each headline
- Uppercase tracked-out eyebrow labels above every heading
- `01 / 02 / 03` numbering on content that is not a sequence
- Identical rounded cards with the same shadow for every kind of content
- Middle-dot meta strings (`React · Node · AWS`) and `→` on every link
- Cream background + serif + terracotta, or black + one neon accent

### Colour (Tailwind default colours only, no hex)
Colour carries meaning: each stack layer has one colour, used everywhere that
layer appears (diagram, Stack section, project tags, timeline tech lists).

| Role | Light mode | Dark mode |
| --- | --- | --- |
| Background | `white`, sections alternate with `neutral-50` | `neutral-900`, alternate `neutral-800/50` |
| Text | `neutral-900`, secondary `neutral-600` | `neutral-100`, secondary `neutral-400` |
| Borders / rules | `neutral-200` | `neutral-700` |
| Interface layer (frontend) | `sky-700` | `sky-300` |
| Application layer (backend/API) | `emerald-700` | `emerald-300` |
| Data layer (databases) | `amber-700` | `amber-300` |
| Infrastructure layer (cloud/tools) | `fuchsia-700` | `fuchsia-300` |
| Links, focus ring, primary button | `sky-700` | `sky-300` |

- Tints for small backgrounds: `<colour>-50` in light, `<colour>-400/10` in dark
- Text colours above all pass WCAG AA on their backgrounds; never use 400/500
  shades for text in light mode
- No gradients except inside the stack diagram, if at all

### Typography
- Display: **Archivo** (variable, load the `wdth` axis). Use it for the name,
  headings, navigation and buttons. The hero name is set in an expanded width
  and heavy weight: the type itself is the hero's visual
- Body: **Source Serif 4** for the bio, project write-ups and case studies
  (long-form reading). Slightly more line height than a sans (`leading-relaxed`)
- Code: **JetBrains Mono**, only for real code snippets in case studies
- All three via `next/font/google`, mapped to `font-display`, `font-serif`
  and `font-mono` in `@theme`
- Font sizes only from Tailwind's scale (`text-sm` … `text-8xl`), set per
  breakpoint in global classes; no px, no `clamp()`
- Body text max width `max-w-prose` (about 65 characters)
- Left-aligned text everywhere; no centred paragraphs

### Layout and sections
- Hero: left column has my name (large, expanded Archivo), one plain sentence
  about what I build, availability line, two buttons and social links. Right
  column (below on mobile) has `StackDiagram`: an SVG of four stacked layers
  (Interface, Application, Data, Infrastructure), each labelled with 3-4 of my
  real technologies. No photo in the hero
- Stack: the same four layers as wide horizontal bands, top to bottom, each with
  a short plain sentence about what I do in that layer and its technologies as
  badges. Not a grid of logos
- Projects: the featured project is a large two-column block (screenshot +
  write-up). Other projects are a simple list or 2-column grid with screenshot,
  title, one-line summary, layer-coloured tags, and links to the case study,
  live site and code. Real screenshots only; `TODO` frame if missing
- Experience: a vertical timeline (this is a real sequence, so dates and order
  matter). Company name as text; no logos unless I provide them
- About: photo (plain, `rounded-lg`, no decorative frame) next to a short bio
- Contact: a clear heading, my email large and selectable with a copy button,
  then LinkedIn, GitHub and Resume. No cards, no glow
- Radii follow hierarchy: `rounded-md` for buttons and badges, `rounded-lg`
  for images and featured blocks, none for full-width bands
- Shadows only where something floats (mobile menu, dropdown); otherwise use
  borders and spacing
- A background pattern is not needed; whitespace and rules do the structure

### Motion (one moment, plus feedback)
- The signature moment: on first load, the stack diagram's layers draw/stack in
  once, top to bottom (about 600ms total). That is the only automatic animation
- Everything else is feedback to an action: theme toggle, mobile menu open/close,
  "Copied" confirmation on the email button, hover/focus colour change on links
  and buttons, active-section underline in the navbar
- No scroll-reveal on every section, no scroll progress bar, no parallax, no tilt
- Only animate `transform` and `opacity`; 150-300ms for feedback
- Wrap the app in `<MotionConfig reducedMotion="user">`; with reduced motion
  the diagram simply appears
- Use `LazyMotion` + `m` components to keep the Motion bundle small

### Rules
- No 3D, particles, canvas or large decorative images; SVG and CSS only
- Light and dark mode both first-class; follow system preference by default
- Mobile first; test at 375px, 768px, 1280px
- Spacing, colours, font sizes, radii and shadows come from Tailwind's default
  theme only; no arbitrary values or hex codes in components

## Tailwind and global CSS classes (responsive)
- No arbitrary values (`text-[17px]`, `w-[523px]`, `bg-[#123456]`). If no
  token fits, ask me first
- Mobile first with Tailwind breakpoints: `sm` 640px, `md` 768px, `lg` 1024px,
  `xl` 1280px, `2xl` 1536px
- Class-based dark mode for next-themes:
  `@custom-variant dark (&:where(.dark, .dark *));`
- Responsive patterns live once in `app/globals.css` and are reused by name.
  In Tailwind 4, `@apply` can only use utilities, so a global class cannot
  `@apply` another global class: combine them in markup (`btn btn-primary`),
  or define the base with `@utility` if it must be composed
- Global classes (prefix-safe names, none start with a Tailwind utility prefix
  like `text-`, `bg-`, `grid-`, `flex-`):
  - `.container-page`: `mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8`
  - `.section`: `py-16 sm:py-20 lg:py-24`
  - `.type-hero`, `.type-h2`, `.type-h3`, `.type-body`, `.type-small`
  - `.layout-cards`: responsive project grid
  - `.layout-split`: one column on mobile, two from `md`
  - `.btn`, `.btn-primary`, `.btn-secondary`, `.badge`
  - `.layer-band`: Stack section band
  - `.nav-link`, `.nav-mobile-menu`, `.timeline-item`, `.prose-case-study`
- Layer colours are driven by a `data-layer="interface|application|data|infrastructure"`
  attribute with variants in `globals.css`, so components never repeat colour chains
- Add a new global class whenever the same group of 3 or more utilities appears
  twice; never duplicate responsive utility chains across components
- Dark styles live inside the global classes with `dark:`
- Keep `globals.css` organised and commented: import + theme, base styles,
  global classes, utilities. Watch selector specificity so section and
  component spacing do not cancel each other out

## Performance
- Target Lighthouse 90+ on Performance, Accessibility, Best Practices, SEO
- `next/image` with width/height; `priority` only for an above-the-fold image
- `next/font` only (no external font links); subset to `latin`
- Server Components by default; `"use client"` only for the theme toggle,
  mobile menu, copy button, navbar active state and stack diagram animation
- Active-section highlight uses `IntersectionObserver`, not scroll listeners
- Check bundle size before adding a dependency
- Lazy-load below-the-fold images

## SEO
- Metadata API in `layout.tsx`: title template, description, keywords,
  canonical, `metadataBase` from `site.siteUrl`
- Per-project metadata on each case-study page
- Open Graph and Twitter images (`opengraph-image.tsx`, using the display font)
- `sitemap.ts` (home + every project page) and `robots.ts`
- JSON-LD `Person` (name, jobTitle, url, sameAs: LinkedIn, GitHub)
- One `h1` per page, logical heading order, descriptive link text
- Favicon and `apple-touch-icon`

## Accessibility
- Semantic HTML (header, nav, main, section, footer)
- Skip-to-content link
- Visible focus ring (`sky-700` / `sky-300`) on every interactive element;
  full keyboard navigation, including the mobile menu (Escape closes it)
- `scroll-padding-top` on `html` so anchor links clear the sticky navbar;
  smooth scrolling only when motion is allowed
- Alt text on all images; `aria-label` on icon-only buttons
- The stack diagram has a text alternative (the same layers as a list)
- "Copied" confirmation announced with `aria-live="polite"`
- Layer colour is never the only signal: layers are always labelled in text
- Colour contrast at least WCAG AA in both themes

## Contact (no form, no API)
- No contact form and no API of any kind: no Route Handlers, no `app/api`,
  no server actions, no email service, no database
- Contact links only: `mailto:`, LinkedIn, GitHub, Resume, all from `/data/site.ts`
- "Copy email" button uses the clipboard API with a short "Copied" confirmation
- Nothing in the project needs environment variables or secrets

## Security
- No secrets or API keys anywhere; if one ever becomes necessary, ask me first
- Security headers in `next.config.ts`: `X-Content-Type-Options`,
  `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`
- External links use `rel="noopener noreferrer"`
- `/docs/` is git-ignored

## Analytics (optional)
- Vercel Analytics or Plausible; no cookie banner needed with privacy-friendly tools

## Dependencies and versions
- Use the latest stable version of every package; no deprecated APIs or old patterns
- Do not rely on memory for APIs or config: check the installed version in
  `package.json` and read its current docs or `node_modules` types first
- Install with `npm install <pkg>@latest`; only pin an older version if
  something breaks, and tell me why
- After adding or upgrading packages, run `npm run lint`, `npx tsc --noEmit`
  and `npm run build`
- Run `npm outdated` and `npm audit` at the end and report anything notable
- Do not add a package when a few lines of code or CSS would do

## Known dev warnings
- Hydration warnings about extra attributes on `<body>` (such as
  `cz-shortcut-listen`) come from browser extensions. Keep
  `suppressHydrationWarning` on `<html>` and `<body>` in `app/layout.tsx`
- Real hydration errors must be fixed, never suppressed: no `Date.now()`,
  `Math.random()`, locale-based date formatting or `typeof window` branches
  in server-rendered output; put those in `useEffect` or client-only components
- next-themes: render the theme toggle icon only after mount to avoid a mismatch

## Code conventions
- Functional components, strict TypeScript, no `any`
- Named exports for components, default exports only for pages/layouts
- Small, single-purpose components
- Tailwind utilities and the global classes only; no inline styles, no CSS
  modules, no arbitrary values
- ESLint + Prettier (with Tailwind class sorting); fix warnings, do not
  disable rules
- I make the commits. Claude does not commit; it suggests a commit message
  (`feat:`, `fix:`, `chore:`) at the end of each step

## Commands
- `npm run dev`          start dev server
- `npm run build`        production build
- `npm run lint`         lint
- `npx tsc --noEmit`     type check
- `npm run format`       Prettier
- `npm run test:e2e`     Playwright smoke + accessibility tests

## Build order (phases and steps)
Work one step at a time. After finishing a step: run lint, type check and
build, summarise what changed, suggest a commit message, then stop and wait
for me to say "next". Never start the next step on your own.

### Phase 1: Foundation
- Step 1.1: Project setup. The repo already contains `CLAUDE.md`, `README.md`,
  `.gitignore`, `/docs/resume.pdf` and `/public/resume.pdf`; never overwrite
  or delete them. If there is no `package.json`:
  ```
  npx create-next-app@latest temp-app --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --disable-git --yes
  cp -rn temp-app/. .
  rm -rf temp-app
  ```
  Then merge the entries from the scaffolded `.gitignore` (`node_modules`,
  `.next`, `.env*`, etc.) into the existing `.gitignore`, add `/docs/` to it,
  run `npm install` and `npm run dev`, and confirm the default page loads
- Step 1.2: Install extra packages at their latest stable versions (run
  `npm view <pkg> version` first, read any changed docs):
  `npm install next-themes motion lucide-react clsx tailwind-merge`
  `npm install -D prettier prettier-plugin-tailwindcss`
  Add the `format` script, a Prettier config with the Tailwind plugin
  (pointing at `app/globals.css`), and run `npm outdated`
- Step 1.3: Create the folder structure with empty files and `cn()` in `lib/utils.ts`
- Step 1.4: Theme provider (class-based dark mode, `disableTransitionOnChange`),
  `next/font` (Archivo with `wdth`, Source Serif 4, JetBrains Mono) mapped to
  font families in `@theme`, `MotionConfig` + `LazyMotion`,
  `suppressHydrationWarning` on `<html>` and `<body>`
- Step 1.5: Global CSS classes in `app/globals.css` from
  "Tailwind and global CSS classes", including the `data-layer` colour variants
- Step 1.6: Shared UI components (Button, Badge, SectionHeading, ThemeToggle,
  and a `Reveal` wrapper reserved for the stack diagram)

### Phase 2: Content data
- Step 2.1: Write `/data/types.ts`, then read the resume and populate `site.ts`
- Step 2.2: Populate `skills.ts` (grouped by layer) and `experience.ts`
- Step 2.3: Populate `projects.ts`; list every TODO and missing detail for me
- Step 2.4: I review the data files before any UI is built from them

### Phase 3: Layout and first impression
- Step 3.1: Navbar (links, theme toggle, mobile menu, active-section highlight)
- Step 3.2: Hero and `StackDiagram` (the one load animation)
- Step 3.3: Footer and the page shell in `app/page.tsx`

### Phase 4: Main sections
- Step 4.1: Stack section (layer bands)
- Step 4.2: Projects section (featured block + list)
- Step 4.3: Project case-study pages (`/projects/[slug]`, `generateStaticParams`)
- Step 4.4: Experience timeline and education
- Step 4.5: About

### Phase 5: Contact
- Step 5.1: Contact section (email, copy button, LinkedIn, GitHub, Resume)
- Step 5.2: Check every link works; external links use `rel="noopener noreferrer"`

### Phase 6: SEO and metadata
- Step 6.1: Metadata API, per-project metadata, OG/Twitter images, favicon
- Step 6.2: `sitemap.ts`, `robots.ts`, JSON-LD Person, `not-found.tsx`, `error.tsx`

### Phase 7: Polish and quality
- Step 7.1: Responsive check at 375px, 768px and 1280px in both themes; fix
  problems in the global classes, not in individual components
- Step 7.2: Design review against the "Avoid" list; remove anything that crept in
- Step 7.3: Accessibility pass (headings, focus, contrast, alt text, keyboard)
- Step 7.4: Performance pass (images, client components, bundle size, Lighthouse 90+)
- Step 7.5: Tests and CI: install `@playwright/test`, `@axe-core/playwright`
  and `@lhci/cli` as dev dependencies; write `tests/smoke.spec.ts` (page loads,
  nav links, theme toggle, copy email, axe has no violations, both themes);
  add `.github/workflows/ci.yml` (lint, type check, build, Playwright, Lighthouse CI)
- Step 7.6: Security headers, `npm outdated`, `npm audit`, final lint, type
  check and build

## Definition of done (for each task)
- Works on mobile and desktop, in light and dark mode
- No console errors or TypeScript errors
- `npm run lint`, `npx tsc --noEmit` and `npm run build` pass
- Content comes from `/data`
- Accessible by keyboard; contrast passes AA
- Nothing from the "Avoid" list
- Styling uses Tailwind's default theme and the global classes: no arbitrary
  values, no hex codes, no repeated responsive utility chains

## Do not
- Do not add a database, auth, a CMS, a contact form, API routes or any
  server code unless I ask
- Do not install large UI libraries (shadcn kits, animation packs) without asking
- Do not hardcode secrets or personal contact details outside `/data/site.ts`
- Do not use arbitrary values or repeat long responsive utility chains
- Do not invent content, metrics or testimonials
- Do not make changes outside the requested section/task