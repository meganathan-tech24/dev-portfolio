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
| `lucide-react` | 1.x | UI icons (no brand logos) |
| `simple-icons` | 16.x | brand/tech logos as SVG path data (no React wrapper) |
| `next-themes` | 0.4.x | light/dark mode |
| `clsx`, `tailwind-merge` | 2.x, 3.x | `cn()` helper in `lib/utils.ts` |
| `eslint`, `eslint-config-next` | 10.x, 16.3.x | linting |
| `prettier`, `prettier-plugin-tailwindcss` | 3.x, 0.8.x | formatting + class sorting |
| `eslint-config-prettier` | 10.x | turns off ESLint rules that clash with Prettier |
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
  CircuitTraces.tsx     # PCB-style traces from the diagram layers (hero)
  /icons
    TechIcon.tsx        # renders a simple-icons logo or a lucide fallback
    LinkedInIcon.tsx    # small local SVG (not in simple-icons)
  GlassBackground.tsx   # fixed background behind the glass surfaces
  LayerMark.tsx         # small logo: "MP" with four layer-colour bars (navbar, footer, favicon)
  /layout
    Navbar.tsx
    MobileMenu.tsx
    Footer.tsx
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
  /images
    Meganathan_Image.png  # my photo for the About section
  favicon
.prettierrc.json
.prettierignore
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
- Rainbow or spectrum gradients, neon glowing orbs, busy moving blob shows
  (the glass background below is allowed, but it stays soft and slow)
- Glass so transparent that text loses contrast
- Typewriter or rotating role text, floating tech icons, logo marquees
  (small tech icons inside badges are fine)
- Animated stat counters ("5+ years · 20+ projects")
- Gradient-ring avatar in the hero
- The same fade-and-slide-up on every element; random hover glow or 3D tilt
- One highlighted gradient word in each headline
- Uppercase tracked-out eyebrow labels above every heading
- `01 / 02 / 03` numbering on content that is not a sequence
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
- Gradients only in the stack diagram, the `.border-flow` card borders and the
  soft glass background; never on text or buttons

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
- Hero ("editorial + request trace"): reference prototype
  `docs/design/hero.html` (copy it there; match its layout and behaviour,
  rebuilt with Tailwind, the global classes and Motion, no hex codes; the
  prototype's inline styles are only for the prototype). At least the
  viewport height minus the header on desktop
  - Layout from `lg`: a grid of `[gutter] [content half] [stage half to the
    page edge]`. The left half aligns with `.container-page`; the right half
    is a "stage" panel that starts at the centre line and bleeds off the right
    edge of the screen (rounded only on its left corners, no right border).
    Columns are `min-w-0`; nothing from the left half may cross into the stage.
    Below `lg` everything stacks: text first, then the stage full width
  - Left column (calm and editorial, no boxes), top to bottom, spacing on an
    8px rhythm (32px between groups, 24px inside a group, 48px before the
    facts):
    1. Status line: pill with pulsing emerald dot and the availability text,
       then a small `location` tag in JetBrains Mono (from `site.ts`; omit
       it until I set it)
    2. Role label above the name: a mini four-bar layer meter, then
       "Senior full-stack developer" in JetBrains Mono, then
       `/ <layer>` in that layer's colour, following the active layer
       (hidden below `sm`)
    3. My name (`h1`) on two lines, weight 900, Archivo `wdth` 116, very tight
       leading. Size comes from the left column, not the viewport: the column
       is a size container and `.type-hero` uses
       `font-size: clamp(2.5rem, 12.6cqi, 8rem)` (the one allowed exception to
       "no clamp()"). Each line `whitespace-nowrap`
    4. Statement in Source Serif, large (`text-2xl` to `text-3xl`), max about
       24 characters per line: "I build multi-tenant products end to end,
       from the interface to the infrastructure." with "interface" in the
       Interface colour and "infrastructure" in the Infrastructure colour
    5. One line about now in Source Serif, muted, `max-w-prose`:
       "Currently building Coheart, a learning platform for cohort-based
       programmes, with React, Node.js and PostgreSQL on Azure." (from
       `site.ts`)
    6. Actions: solid "See my work" (`ArrowDown`) and outline "Get in touch";
       under them two quiet text links with outline icons: "Resume"
       (`FileDown`, only when the web-safe `/resume.pdf` exists) and
       "LinkedIn" (outline `LinkedInIcon`), plus "GitHub" once `site.ts` has it
    7. Facts row (a `<dl>`, no card): a top rule, then three items separated
       by thin vertical rules, label in JetBrains Mono, value in Archivo 800:
       Experience "4+ years" (computed from `experience.ts`) with a small bar
       of one segment per year; Now at "Teckollab" with the role under it;
       Latest build "Coheart" with an underlined "Read case study" link.
       Stacks to one column below `sm`
  - Right column: the "stage", a glass panel with a 24px blueprint grid:
    - Top bar: `trace` (mono, muted) + "Loading a cohort dashboard", a
      Request/Response tag (border in the active layer's colour), "Layer N of
      4" (mono) and a Pause/Play button (`aria-pressed`) that stops all stage
      motion. Hidden under reduced motion
    - Body: on the left the exploded isometric `StackDiagram` (four plates,
      2D SVG polygons: diamond top with dashed inner diamond, two side faces,
      layer colour outline; light mode tints the top about 14% and the sides
      about 38% with a soft coloured shadow under each plate; dark mode dark
      tops, sides about 18%, glow allowed) with short circuit traces running
      out of each plate's left corner, inside the panel. On the right a
      layer card per plate, vertically aligned with it and joined by a dashed
      connector:
      - Layer name in its colour and the step number (01 to 04)
      - One sentence on what that layer does in this request (from
        `skills.ts`, `requestStep`): "React renders the dashboard",
        "Express API checks the tenant", "Prisma reads the cohort from
        PostgreSQL", "Runs on Azure, shipped by GitHub Actions"
      - All technologies for that layer
    - Footer: "Hover a layer to explore it" and a small four-colour legend
    - From `lg` to `xl` the cards move under the stack in a 2x2 grid; below
      `sm` they become one column; the stage stays full width
    - Text alternative: the stack is `aria-hidden`; a visually hidden summary
      lists every layer, its step and technologies (no SVG `<title>`)
  - Active layer: ONE shared state (a small context or store) drives the
    request dot, the highlighted plate, the highlighted card, the role label's
    layer word and meter, "Layer N of 4" and the Request/Response tag. They
    must never show different layers
  - Short screens (desktop height under about 860px, e.g. 1366x768): tighter
    spacing so the whole hero including the facts row fits above the fold
  - Background: plain page background with one soft, low-opacity colour field
    behind the stage; no blobs elsewhere in the hero
- Stack: the same four layers as wide horizontal bands, top to bottom, each with
  a short plain sentence about what I do in that layer and its technologies as
  badges. Each band heading has a lucide icon for the layer (Interface:
  `Monitor`, Application: `Server`, Data: `Database`, Infrastructure: `Cloud`),
  and each technology badge shows its logo before the name (see "Icons").
  Not a grid of logos
- Projects: the featured project is a large two-column block (screenshot +
  write-up). Other projects are a simple list or 2-column grid with screenshot,
  title, one-line summary, layer-coloured tags, and links to the case study,
  live site and code. Real screenshots only; `TODO` frame if missing
- Experience: a vertical timeline (this is a real sequence, so dates and order
  matter). Company name as text; no logos unless I provide them. Use the full
  width from `lg`: a sticky left column with role, company, dates, location and
  tech badges, and the bullets on the right. Show at most 4 bullets per job,
  with a "Show all" toggle for the rest
- Education: its own sub-section after the jobs, not plain text. Each entry is
  a glass card with a `GraduationCap` icon, degree and field as the title,
  institution, dates and location, plus any grade, coursework, final-year
  project or certifications that are in the resume (nothing invented; skip
  what is not there). If there is more than one entry, show them on the same
  timeline line as the jobs with a different dot shape (square) so study and
  work read as one story. Certifications from the resume get small badges
- About: my photo from `/public/images/Meganathan_Image.png` with `next/image`
  (width/height set, lazy-loaded, alt text "Meganathan Palanisamy"),
  `rounded-lg`, with the animated layer border (see "Card borders") next to a
  short bio. Path comes from `site.ts` (`photo`), not hardcoded
- Contact ("Get in touch"): a full-screen final call to action, not a card or
  form. Reference prototype: `docs/design/get-in-touch.html` (copy it there;
  match its layout and behaviour, but rebuild it with Tailwind classes, the
  global classes and Motion, no hex codes or inline styles)
  - Section: at least the viewport height on desktop, content in
    `.container-page`, left-aligned
  - Background: a faint 48px grid (`neutral` lines at low opacity) that is
    only visible inside a soft circle around the cursor (CSS mask using
    `--mx` / `--my` custom properties set on pointer move). No grid on touch
    devices; a static faded grid instead
  - Status pill: pulsing emerald dot, "Open to full-stack roles" plus "and
    freelance projects" (the second part hidden below `sm`), from `site.ts`
  - Headline (`h2`, the largest type after the hero name, about `text-6xl` to
    `text-9xl` by breakpoint, weight 900, tight leading): two lines,
    "Got something" / "to build?", text from `site.ts`
    - Line 1 animates the Archivo `wdth` axis from 70 to 118 once when the
      section enters the viewport
    - Line 2 starts as outline text (`-webkit-text-stroke` in the border
      colour) and fills with solid text from left to right (`clip-path`
      inset animation, about 1.2s, after line 1)
    - After the fill, a small four-colour bar (the layer colours in order)
      scales in after the question mark
  - Lede in Source Serif: one or two sentences from `site.ts` saying what I
    build and inviting an email; max `max-w-prose`
  - Main row, two columns from `lg` (stacked below):
    - Email card (wider column), a `button` that copies the email:
      - Animated four-colour conic border (`.border-flow`, about 6s per turn,
        2s on hover/focus) and, in dark mode only, a blurred glow of the same
        gradient underneath
      - Top line: "Email, the fastest way to reach me" and a "Press C" key hint
        (hidden on touch devices and below `sm`)
      - The address in large Archivo (about `text-2xl` to `text-4xl`), the `@`
        in the Interface colour, with a `<wbr>` before the `@` so it only ever
        wraps there, never mid-word
      - Actions: a solid pill "Copy email" (`Copy` icon morphs to `Check`,
        label becomes "Copied", pill turns emerald for about 2s) and a text
        link "Open in mail app" (`mailto:`, does not trigger copy)
      - On desktop with a fine pointer, the card leans up to 14px towards the
        cursor (magnetic effect, `transform` only) and resets on leave
    - Side column, three link cards stacked: LinkedIn (emerald), GitHub
      (amber), Resume (fuchsia). Each: icon tile in its colour tint, small
      label, value in Archivo, and a round arrow button on the right (down
      arrow for Resume). Hover/focus: card shifts 6px right, border takes its
      colour, a radial spotlight in its colour follows the cursor, and the
      arrow button fills with its colour and rotates -45 degrees
    - GitHub card is hidden in production until `site.ts` has a GitHub URL
  - Keyboard shortcut: pressing `C` copies the email while the section is in
    view, unless focus is in a text field or a modifier key is held
  - Feedback: a small toast at the bottom centre ("Email copied. Talk soon.")
    with `role="status"` and `aria-live="polite"`, gone after about 2s
  - Bottom: thin circuit traces in the four layer colours with travelling
    pulses (same technique as `CircuitTraces`), then one line "Interface,
    application, data, infrastructure. Built end to end." and my name
  - Reduced motion: headline shown fully expanded and filled, no border spin,
    no pulses, no magnetic lean, no cursor spotlight; copy feedback stays
  - Light mode: no glow, 700-shade colours, white cards with borders; dark
    mode: 300/400 shades with glow
  - All text and links come from `site.ts`
- Contact and footer must not repeat each other: the footer has no big email,
  no "Looking for..." line and no copy button
- Header (navbar): "Stack bar"
  - Always a solid surface, never transparent over content: `.glass-strong`
    tuned to be nearly opaque (light `bg-white/90`, dark `bg-neutral-900/90`,
    `backdrop-blur-xl`) with a `neutral-200` / `neutral-700` bottom border.
    Sticky at the top, full width, content inside `.container-page`
  - Top edge: a 4px strip split into four equal segments in the layer colours,
    left to right Interface (sky), Application (emerald), Data (amber),
    Infrastructure (fuchsia). This strip replaces the separate scroll-progress
    bar:
    - Each segment is dim (about 30% opacity) by default
    - The segment for the section in view lights up to full strength:
      Stack = all four, Projects = Interface, Experience = Application,
      About = Data, Contact = Infrastructure
    - Inside the lit segment, a fill grows left to right as you scroll through
      that section (`scaleX`), so the strip is also the progress indicator
  - Left: `LayerMark` (four short stacked bars in the layer colours) and my
    first name "Meganathan" in Archivo, medium weight, slightly expanded width.
    Show the full name from `lg`. Clicking it scrolls to the top. Keep clear
    spacing between the mark and the name (no overlap or squashing)
  - Right: section links (Stack, Projects, Experience, About, Contact) with
    the active link in `neutral-900` / `neutral-100` and a 2px underline in
    that section's colour (same mapping as the strip), sliding between links
    with `layoutId`; then the theme toggle as a bordered square icon button
  - No Resume button and no availability pill in the header. The Resume
    download stays in the Contact section and the footer
  - Height about 64px; it does not hide on scroll and does not change size
  - Theme toggle: render a same-size placeholder until mounted, then the sun
    or moon icon; it must never show as an empty box
  - Mobile (below `md`): mark + name on the left, theme toggle and a menu
    button (`Menu` / `X` icons) on the right; the strip stays on top.
    Menu opens a full-screen `.glass-strong` panel with large links
    (`type-h2`), each with its layer colour marker, appearing in a short
    stagger; below them icon buttons for email, LinkedIn and GitHub. Focus is
    trapped while open, Escape and a link click close it, body scroll is locked
- Footer: compact and quiet, because Contact directly above already does the
  asking
  - A thin four-colour line (the layer colours in order) at the top edge
  - Main row, three columns from `md` (stacked on mobile):
    - Brand: `LayerMark`, my name, my role from `site.ts` in one line, and
      the availability line
    - "Sections": the page links
    - "Stack": the four layer names, each with its colour marker; clicking
      one sets the site-wide layer highlight and scrolls to Stack
  - Social icons row: email, LinkedIn, GitHub and Resume as small icon-only
    buttons (with `aria-label`), no text labels
  - Bottom row with a top rule: "© {year} Meganathan Palanisamy" (year
    computed at build time on the server), "Built with Next.js, Tailwind CSS
    and Motion" with small logos, and a "Back to top" button with an
    `ArrowUp` icon
  - Plain page background (no glass panel and no `.border-flow` in the
    footer)
  - Optional: my local time ("Chennai, IST") only if I confirm the city in
    `site.ts` (`location`); render it client-side only. Leave it out until then
  - All footer content comes from `site.ts`, `skills.ts` and the section list
- The favicon and `apple-touch-icon` use `LayerMark`
- Radii follow hierarchy: `rounded-md` for buttons and badges, `rounded-lg`
  for images and featured blocks, none for full-width bands
- Shadows: soft `shadow-lg` / `shadow-xl` on glass surfaces only

### Background and glass (both themes)
- `GlassBackground`: one fixed layer behind the whole page (`fixed inset-0
  -z-10`) with four large, very soft colour fields in the layer colours
  (sky, emerald, amber, fuchsia), heavily blurred (`blur-3xl`), at low opacity:
  about 20-30% in light mode, about 15-20% in dark mode, over the page
  background from the Colour table. They drift very slowly (30-60s loops, `transform` only) and
  stop under reduced motion
- Glass surfaces sit on top of it: navbar, cards (projects, education,
  contact, About photo frame), the stack diagram and the mobile menu
  - Light: `bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg`
  - Dark: `bg-neutral-900/50 backdrop-blur-xl border border-white/10 shadow-xl`
  - Defined once as `.glass` and `.glass-strong` (navbar, mobile menu) in
    `globals.css`
- Text on glass must still pass WCAG AA: if a check fails, make the glass more
  opaque rather than changing the text colour
- Performance: no more than about 8 glass surfaces on screen at once; on
  phones (base styles) use `backdrop-blur-md`, and `xl` blur from `md` up.
  Use `@supports not (backdrop-filter: blur(1px))` to fall back to an opaque
  background

### Card borders (animated, theme-aware)
- Featured project, project cards, education cards, the contact panel and the
  About photo get a thin (1-2px) border with a colour sweep that travels
  around the edge
- Built once as `.border-flow` in `globals.css`: a pseudo-element with a
  `conic-gradient` of the four layer colours, rotated with `transform:
  rotate()` in a keyframe (compositor-friendly), masked so only the border
  ring shows. No JavaScript
- Theme: dark mode uses the 400 shades at full strength; light mode uses the
  500 shades at lower opacity so it stays subtle on white
- Speed: one slow loop (about 8s) at rest; on hover/focus the border
  brightens and speeds up (about 3s). A project card may use only its own
  layer colours
- Pause the animation when the card is off screen if that is cheap (CSS
  `animation-play-state` toggled by the existing IntersectionObserver);
  under reduced motion show a static gradient border

### Icons
- UI icons: `lucide-react` (it has no brand logos)
- Tech logos: `simple-icons`, imported by name (e.g. `siReact`) so only used
  icons are bundled, rendered by `TechIcon` as an inline SVG using
  `currentColor`, so logos take the layer colour instead of brand colours
- `skills.ts` stores an `icon` key per technology; `TechIcon` maps it
- Not in simple-icons (checked 2026-10-03): LinkedIn, Microsoft Azure,
  OpenAI, Mux. Use lucide fallbacks for these (`Cloud` for Azure, `Sparkles`
  for OpenAI, `Video` for Mux) and a small local `LinkedInIcon` SVG. For any
  other missing logo, fall back to a lucide icon for its layer
- Icon size follows the text (`size-4` in badges, `size-5` in buttons)

### Motion (alive, but every animation is about layers or a user action)
The site must feel interactive and alive. Every animation should show the
"system of layers" idea or respond to what the visitor does, never be random
decoration.

Hero
- Load sequence (about 2.5s, once): status line, role label and name fade
  in (the name's letters rise in, about 28ms apart, `wdth` 64 to 116); then
  the statement, line about now, actions and facts fade in; the stage slides
  in from the right; the four plates drop onto a closed stack, then separate
  into the exploded view (about 700ms); then the traces fade in and the
  request dot starts
- Request dot: travels down the stack axis (Request) and back up (Response),
  about 3.4s each way with a short pause at each end. Within a plate it takes
  that layer's colour and sets the shared active layer. It pauses when the
  tab is hidden, the hero is off screen or the Pause button is pressed
- Hovering or focusing a plate or a card overrides the dot: that layer is
  active, the other plates fade to about 30% and the other cards to about 45%;
  the active card lifts slightly and takes its layer colour border and tint.
  Each plate is focusable with a visible focus outline
- Circuit traces: from the left corner of each plate in the exploded stack,
  two short circuit-board style traces run towards the left, staying inside
  the stage panel (the right side is used by the layer cards):
  - Each layer has 2-3 traces in its own colour (sky, emerald, amber,
    fuchsia). Traces run horizontally, bend only at 45 degrees, split and
    re-join a little, and end at different lengths in a small ring "pad"
    (an open circle). They never cross another layer's traces
  - Built as one inline SVG component (`CircuitTraces.tsx`) next to
    `StackDiagram`, positioned behind the hero content, `aria-hidden`.
    Paths are hand-written in the component (no image file), using
    `pathLength="1"` so lengths are easy to animate
  - Load: after the layers drop in, each layer's traces draw outwards from the
    diagram (stroke-dash animation from 0 to full, about 600-900ms, layer by
    layer top to bottom), then the pads pop in (scale from 0)
  - Idle: small bright "data pulses" (short dash segments) travel along the
    traces from the diagram to the pads every few seconds, at slightly
    different times per trace. When the request-trace dot passes a layer,
    that layer's traces send a pulse at the same moment, so the hero reads as
    one connected system
  - Hover on a layer: its traces brighten and pulse faster; other layers'
    traces dim (matches the diagram's hover)
  - Glow: a soft glow (SVG `feGaussianBlur` filter, small radius) in dark
    mode using the 300/400 shades; in light mode use the 600 shades with
    almost no glow so it stays clean on white. Stroke width 1.5-2px, pads
    about 8px
  - Responsive: full traces from `lg`; on tablets keep one trace per layer;
    below `md` (diagram stacked under the text) hide the traces
  - Performance: no more than about 12 paths; pulses use CSS animation on
    `stroke-dashoffset` of a duplicate path; pause when the hero is off
    screen or the tab is hidden
  - Reduced motion: traces and pads are drawn in their final state, no
    pulses

Layer highlight (site-wide interaction)
- The layer legend ("Interface, Application, Data, Infrastructure") is
  clickable. Selecting a layer highlights its tags everywhere on the page
  (Stack, Projects, Experience) and dims the rest; click again to clear
- Store the selected layer in a small client context, not in the URL

Scrolling
- Each section heading and its first block reveal once as they enter the
  viewport. Vary the reveal by section instead of one identical fade-up:
  - Stack: each band's coloured left rule draws downward (`scaleY`), then its
    badges appear in a quick stagger
  - Projects: the featured block's screenshot slides in from its side; grid
    items appear in a short stagger
  - Experience: the timeline line draws from top to bottom as you scroll
    down (scroll-linked `scaleY` from 0 to 1 with `transform-origin: top`,
    Tailwind `origin-top`). It starts at the first (newest) job and ends at
    the last education entry, and must never grow upwards from the bottom or
    from the middle. Map the scroll progress so the line's tip stays near the
    middle of the viewport; each dot fills with colour when the tip passes it.
    Scrolling back up shrinks the line again; the dots stay filled once reached
- Scroll progress is shown by the header's four-segment layer strip (see Header)

Interaction feedback
- Navbar: the active-section underline slides between links in that
  section's colour (shared layout animation with `layoutId`)
- Buttons: slight lift and press (`translate-y`, `scale`) with a layer-coloured
  focus ring
- Badges: lift slightly on hover
- Project items: screenshot zooms slightly inside its frame on hover, the
  border takes the colour of the project's main layer, and the "Read case
  study" link shows a short underline sweep
- Copy email: the copy icon morphs into a check, "Copied" appears, then returns
- Theme toggle: sun and moon rotate and cross-fade
- Case-study pages: use the View Transitions support in the installed Next.js
  / React version (if available) so the project title and screenshot morph
  from the list into the case-study page; otherwise a simple fade

Rules for motion
- Use Motion (`motion/react`) with `LazyMotion` + `m` components
- Animate `transform` and `opacity`. The exceptions are the hero name's
  `font-variation-settings` (one time, one element), the request-trace glow
  and the circuit traces' `stroke-dashoffset` (small SVG paths only).
  The background drift and border sweep use `transform` only
- Durations: 150-300ms for feedback, 400-800ms for reveals and load sequences
- Reveals run once, never on every scroll back up
- Wrap the app in `<MotionConfig reducedMotion="user">`. With reduced motion:
  no request-trace loop, no scroll-linked effects, everything shows in its
  final state, hover colour changes stay
- Content must be visible without JavaScript (start from the visible state on
  the server; only hide-then-reveal after hydration)

### Placeholders until real assets exist
- Missing project screenshots: render a designed fallback, not an empty grey
  box. A simple browser-window frame with the project name set large and
  thin stripes in the colours of the project's layers, plus a small
  `TODO: screenshot` note for me

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
  - `.glass`, `.glass-strong`, `.border-flow`, `.edu-card`
- Keyframes for the background drift and border sweep are defined once as
  `--animate-*` tokens in `@theme`
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

## Formatting (Prettier)
`.prettierrc.json`:
```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./app/globals.css",
  "tailwindFunctions": ["cn", "clsx"]
}
```
`.prettierignore`:
```
.next
node_modules
out
coverage
playwright-report
test-results
package-lock.json
public
docs
```
- `package.json` scripts: `"format": "prettier --write ."` and
  `"format:check": "prettier --check ."`
- Add `eslint-config-prettier` as the last entry in `eslint.config.mjs` so
  ESLint and Prettier never fight
- CI runs `npm run format:check`
- Optional for VS Code: `.vscode/settings.json` with
  `"editor.defaultFormatter": "esbenp.prettier-vscode"` and
  `"editor.formatOnSave": true`

## Commands
- `npm run dev`          start dev server
- `npm run build`        production build
- `npm run lint`         lint
- `npx tsc --noEmit`     type check
- `npm run format`       Prettier (write)
- `npm run format:check` Prettier (check only, used in CI)
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
- Step 7.2: Design review against the "Avoid" list and the Motion section;
  remove anything that crept in and add anything that is missing
- Step 7.3: Accessibility pass (headings, focus, contrast, alt text, keyboard)
- Step 7.4: Performance pass (images, client components, bundle size, Lighthouse 90+)
- Step 7.5: Tests and CI: install `@playwright/test`, `@axe-core/playwright`
  and `@lhci/cli` as dev dependencies; write `tests/smoke.spec.ts` (page loads,
  nav links, theme toggle, copy email, axe has no violations, both themes);
  add `.github/workflows/ci.yml` (lint, type check, build, Playwright, Lighthouse CI)
- Step 7.6: Security headers, `npm outdated`, `npm audit`, final lint, type
  check and build

### Phase 8: Visual upgrade
- Step 8.1: Prettier setup from "Formatting (Prettier)": config files,
  scripts, `eslint-config-prettier`; run `npm run format` once and report
  which files changed
- Step 8.2: `GlassBackground`, `.glass` and `.glass-strong`, applied to the
  navbar, mobile menu, stack diagram and existing cards; check contrast in
  both themes
- Step 8.3: `.border-flow` animated borders on the featured project, project
  cards and contact panel, with reduced-motion and off-screen handling
- Step 8.4: About photo from `/public/images/Meganathan_Image.png` with the
  animated border; add `photo` to `site.ts`; check the file size and tell me if
  it is over 500 KB
- Step 8.5: Icons: install `simple-icons`, build `TechIcon` and
  `LinkedInIcon`, add `icon` keys to `skills.ts`, layer icons on Stack band
  headings and logos in all tech badges (Stack, Projects, Experience)
- Step 8.6: Education redesign (glass cards, timeline integration,
  certifications); list anything in the resume that I should add or that is
  missing
- Step 8.7: Contact icons and glass panel
- Step 8.8: Header redesign ("Stack bar"): solid header, four-segment layer
  strip with active-section highlight and per-section progress (remove the old
  separate scroll-progress bar), `LayerMark` + name, coloured sliding
  underline, fixed theme toggle icon, no Resume button, new mobile menu with
  focus trap
- Step 8.9: Contact and footer redesign: Contact becomes the two-column
  "contact stack" (email, LinkedIn, GitHub, Resume rows); the footer becomes
  compact (brand, sections, stack shortcuts, icon links, build-time year,
  "Back to top") and loses the duplicate email call-to-action; favicon from
  `LayerMark`
- Step 8.10: Hero circuit traces: replace the straight lines with
  `CircuitTraces` (draw-in, pads, data pulses synced with the request trace,
  hover, responsive and reduced-motion rules)
- Step 8.11: "Get in touch" final call to action: rebuild Contact from the
  "Contact" spec and `docs/design/get-in-touch.html` (headline animation,
  email card with magnetic lean and copy, link cards with spotlight, `C`
  shortcut, toast, cursor grid, bottom traces, reduced motion, both themes)
- Step 8.12: Hero rebuild ("editorial + request trace") from the "Hero" spec
  and `docs/design/hero.html`: content/stage grid with the stage bleeding to
  the right edge, editorial left column, facts row, stage with top bar,
  exploded stack, layer cards and Pause button, one shared active-layer
  state, short-screen spacing; add `requestStep` to each layer in
  `skills.ts` and `location`/`now` to `site.ts`; test with the real Archivo
  font at 1848, 1366x768, 1024, 768 and 390px in both themes and with reduced
  motion
- Step 8.13: Full check: both themes at 375px, 768px and 1280px, reduced
  motion, keyboard (including the mobile menu), axe, Lighthouse (mobile
  Performance 90+; if the glass or borders push it lower, tell me which one
  and suggest a lighter setting)

## Definition of done (for each task)
- Works on mobile and desktop, in light and dark mode
- No console errors or TypeScript errors
- `npm run lint`, `npx tsc --noEmit` and `npm run build` pass
- Content comes from `/data`
- Accessible by keyboard; contrast passes AA
- Nothing from the "Avoid" list
- `npm run format:check` passes
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