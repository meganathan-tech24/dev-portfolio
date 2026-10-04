import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { projects } from "../data/projects";
import { site } from "../data/site";

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/**
 * Open the home page and wait until React has hydrated, so clicks and hovers are not
 * lost to a page that is not interactive yet. ScrollEffects marks the progress bar as
 * ready once it has run (it does nothing with reduced motion).
 */
async function openHome(page: Page) {
  await page.goto("/");
  const reduced = await page.evaluate(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  if (!reduced) {
    await expect(page.locator(".scroll-progress")).toHaveAttribute("data-ready", "");
  }
}

/** Scroll through the whole page so every scroll reveal has played, then return to the top */
async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = await page.evaluate(() => window.innerHeight * 0.7);
  for (let y = 0; y < height; y += step) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
}

test.describe("page loads", () => {
  test("home page has the name, one h1 and no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await openHome(page);

    await expect(page).toHaveTitle(site.seo.title);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(site.name);
    for (const item of site.nav) {
      await expect(page.locator(`#${item.id}`)).toBeAttached();
    }
    expect(errors).toEqual([]);
  });

  test("has no horizontal scroll", async ({ page }) => {
    await openHome(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });

  for (const project of projects) {
    test(`case study /projects/${project.slug} loads`, async ({ page }) => {
      const response = await page.goto(`/projects/${project.slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(project.title);
      await expect(page).toHaveTitle(new RegExp(project.title));
    });
  }

  test("an unknown project is a 404 with a way home", async ({ page }) => {
    const response = await page.goto("/projects/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Go to the home page" })).toBeVisible();
  });
});

test.describe("navigation", () => {
  test("desktop nav links go to their sections", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "desktop nav is hidden on mobile");
    await openHome(page);

    const nav = page.getByRole("navigation", { name: "Main", exact: true });
    for (const item of site.nav) {
      await nav.getByRole("link", { name: item.label }).click();
      await expect(page).toHaveURL(new RegExp(`#${item.id}$`));
      await expect(page.locator(`#${item.id}`)).toBeInViewport();
      await expect(nav.getByRole("link", { name: item.label })).toHaveAttribute(
        "aria-current",
        "location",
      );
    }
  });

  test("mobile menu opens, navigates and closes with Escape", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "mobile menu only exists on mobile");
    await openHome(page);

    const button = page.getByRole("button", { name: "Open menu" });
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await button.click();

    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();

    await page.getByRole("button", { name: "Open menu" }).click();
    await menu.getByRole("link", { name: "Contact" }).click();
    await expect(menu).toHaveCount(0);
    await expect(page.locator("#contact")).toBeInViewport();
  });

  test("skip link is the first tab stop and jumps to main", async ({ page }) => {
    await openHome(page);
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe("theme", () => {
  for (const scheme of ["light", "dark"] as const) {
    test.describe(`system preference is ${scheme}`, () => {
      test.use({ colorScheme: scheme });

      test("the page follows it", async ({ page }) => {
        await openHome(page);
        const html = page.locator("html");
        if (scheme === "dark") await expect(html).toHaveClass(/dark/);
        else await expect(html).not.toHaveClass(/dark/);
      });
    });
  }

  test("toggle switches theme, updates its label and persists", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await openHome(page);

    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);

    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(html).toHaveClass(/dark/);
    await expect(page.getByRole("button", { name: "Switch to light theme" })).toBeVisible();

    await page.reload();
    await expect(html).toHaveClass(/dark/);

    await page.getByRole("button", { name: "Switch to light theme" }).click();
    await expect(html).not.toHaveClass(/dark/);
  });
});

test.describe("contact", () => {
  test("copy email copies the address and confirms", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await openHome(page);

    const contact = page.locator("#contact");
    await expect(contact.getByText(site.links.email, { exact: true })).toBeVisible();

    await contact.getByRole("button", { name: "Copy email" }).click();
    await expect(contact.getByRole("button", { name: "Copied" })).toBeVisible();
    await expect(contact.getByRole("status")).toHaveText("Email address copied to the clipboard");

    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toBe(site.links.email);

    await expect(contact.getByRole("button", { name: "Copy email" })).toBeVisible({
      timeout: 4000,
    });
  });

  test("mailto and external links are set up safely", async ({ page }) => {
    await openHome(page);
    await expect(
      page.locator("#contact").getByRole("link", { name: "Send an email" }),
    ).toHaveAttribute("href", `mailto:${site.links.email}`);

    const external = page.locator('a[target="_blank"]');
    const count = await external.count();
    for (let i = 0; i < count; i++) {
      const rel = (await external.nth(i).getAttribute("rel")) ?? "";
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
    }
  });
});

test.describe("accessibility (axe)", () => {
  const paths = ["/", `/projects/${projects[0].slug}`, "/does-not-exist"];

  for (const scheme of ["light", "dark"] as const) {
    test.describe(`${scheme} mode`, () => {
      test.use({ colorScheme: scheme });

      for (const path of paths) {
        test(`${path} has no violations`, async ({ page }) => {
          await page.goto(path);
          // let the load animation (about 1.6s) finish and play every scroll reveal,
          // so contrast is measured on the final colours of all the content
          await page.waitForTimeout(2000);
          await scrollThrough(page);
          await expect(page.locator('[data-reveal-state="hidden"]')).toHaveCount(0);

          const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
          expect(results.violations).toEqual([]);
        });
      }
    });
  }

  test("mobile menu has no violations when open", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "mobile menu only exists on mobile");
    await openHome(page);
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    await page.waitForTimeout(400);

    const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
    expect(results.violations).toEqual([]);
  });
});

const LAYERS = ".stack-plate .plate-drop";

test.describe("hero load animation", () => {
  test("plays on load and ends fully visible, with the name expanded", async ({ page }) => {
    await openHome(page);
    // the stack has separated after about 2s
    await page.waitForTimeout(2600);

    const layers = page.locator(LAYERS);
    await expect(layers).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(layers.nth(i)).toHaveCSS("opacity", "1");
    }
    await expect(page.locator(".name-letter").first()).toHaveCSS("font-stretch", "116%");
    await expect(page.locator(".plate-sep").first()).toHaveCSS("transform", "none");
  });

  test("does not shift the layout noticeably", async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { __cls: number };
      w.__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & {
            value: number;
            hadRecentInput: boolean;
          };
          if (!shift.hadRecentInput) w.__cls += shift.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await openHome(page);
    await page.waitForTimeout(2200);

    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
    // 0.1 is the "good" threshold for Cumulative Layout Shift
    expect(cls).toBeLessThan(0.1);
  });
});

test.describe("scroll animations", () => {
  test("content below the first screen is hidden after hydration and reveals once", async ({
    page,
  }) => {
    await openHome(page);

    const band = page.locator("#stack .layer-band").first();
    await expect(band).toHaveAttribute("data-reveal-state", "hidden");
    await expect(page.locator("#hero-heading")).not.toHaveAttribute("data-reveal-state", /.+/);

    await page.locator("#stack").scrollIntoViewIfNeeded();
    await expect(band).toHaveAttribute("data-reveal-state", "shown");
    await expect(band.locator(".band-text")).toHaveCSS("opacity", "1");
    await expect(band.locator(".band-tags li").first()).toHaveCSS("opacity", "1");

    // reveals run once: going back up does not hide anything again
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await expect(band).toHaveAttribute("data-reveal-state", "shown");
    await expect(band.locator(".band-text")).toHaveCSS("opacity", "1");
  });

  test("each section reveals in its own way", async ({ page }) => {
    await openHome(page);

    // Stack: the rule is scaled to nothing and will draw downward
    const rule = await page.evaluate(
      () => getComputedStyle(document.querySelector("#stack .layer-band")!, "::before").transform,
    );
    expect(rule).toBe("matrix(1, 0, 0, 0, 0, 0)");

    // Projects: the featured screenshot waits off to its left (2rem), grid items sit 0.75rem low
    await expect(page.locator('#projects [data-reveal="slide-left"]')).toHaveCSS(
      "transform",
      "matrix(1, 0, 0, 1, -32, 0)",
    );
    await expect(page.locator("#projects .layout-cards > li").first()).toHaveCSS(
      "transform",
      "matrix(1, 0, 0, 1, 0, 12)",
    );

    // the second grid item is staggered behind the first
    await expect(page.locator("#projects .layout-cards > li").nth(1)).toHaveCSS(
      "transition-delay",
      "0.12s",
    );
  });

  test("the progress bar fills with the four layer colours in order", async ({ page }) => {
    await openHome(page);
    const bar = page.locator(".scroll-progress");
    await expect(bar).toHaveAttribute("data-ready", "");
    await expect(bar).toHaveCSS("opacity", "1");

    const order = await bar
      .locator("span[data-layer]")
      .evaluateAll((spans) => spans.map((span) => (span as HTMLElement).dataset.layer));
    expect(order).toEqual(["interface", "application", "data", "infrastructure"]);

    const cover = () =>
      page.evaluate(
        () => getComputedStyle(document.querySelector(".scroll-progress-cover")!).transform,
      );
    expect(await cover()).toBe("matrix(1, 0, 0, 1, 0, 0)"); // nothing revealed yet

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect.poll(cover).toBe("matrix(0, 0, 0, 1, 0, 0)"); // fully revealed at the bottom
  });

  test("the timeline line draws with the scroll and fills each dot as it arrives", async ({
    page,
  }) => {
    await openHome(page);
    const list = page.locator("[data-timeline]");
    await expect(list).toHaveAttribute("data-timeline", "active");

    const read = () =>
      page.evaluate(() => {
        const element = document.querySelector("[data-timeline]") as HTMLElement;
        return {
          progress: Number(element.style.getPropertyValue("--timeline-progress")),
          reached: [...element.querySelectorAll(".timeline-item")].map((item) =>
            item.hasAttribute("data-reached"),
          ),
        };
      });
    // scroll so the line's reference point sits `fraction` of the way down the list
    const scrollTo = (fraction: number) =>
      page.evaluate((f) => {
        const element = document.querySelector("[data-timeline]")!;
        const box = element.getBoundingClientRect();
        window.scrollTo(0, window.scrollY + box.top - window.innerHeight * 0.6 + box.height * f);
      }, fraction);

    await scrollTo(-0.5);
    await expect.poll(read).toMatchObject({ progress: 0, reached: [false, false] });

    await scrollTo(0.45);
    await expect.poll(async () => (await read()).reached).toEqual([true, false]);
    const mid = (await read()).progress;
    expect(mid).toBeGreaterThan(0.3);
    expect(mid).toBeLessThan(0.6);

    await scrollTo(1.3);
    await expect.poll(read).toMatchObject({ progress: 1, reached: [true, true] });
  });
});

/** The computed colour of a CSS custom property on an element (e.g. --main-fg) */
function colourOfVar(locator: Locator, variable: string) {
  return locator.evaluate((element, name) => {
    const probe = document.createElement("i");
    probe.style.color = `var(${name})`;
    element.appendChild(probe);
    const colour = getComputedStyle(probe).color;
    probe.remove();
    return colour;
  }, variable);
}

test.describe("interaction feedback", () => {
  test("the navbar underline slides from link to link", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "desktop nav is hidden on mobile");
    await openHome(page);
    const nav = page.getByRole("navigation", { name: "Main", exact: true });

    await nav.getByRole("link", { name: "Stack" }).click();
    await expect(nav.locator(".nav-underline")).toHaveCount(1);
    await expect(nav.getByRole("link", { name: "Stack" }).locator(".nav-underline")).toBeVisible();

    // sample the underline's position every frame while it moves to Experience
    const xs = await page.evaluate(async () => {
      const found: number[] = [];
      (
        document.querySelector('nav[aria-label="Main"] a[href="/#experience"]') as HTMLElement
      ).click();
      const end = performance.now() + 1800;
      await new Promise<void>((resolve) => {
        const tick = () => {
          const line = document.querySelector(".nav-underline");
          if (line) found.push(Math.round(line.getBoundingClientRect().left));
          if (performance.now() < end) requestAnimationFrame(tick);
          else resolve();
        };
        tick();
      });
      return found;
    });
    expect(new Set(xs).size).toBeGreaterThan(4); // it travelled through in-between positions
    await expect(
      nav.getByRole("link", { name: "Experience" }).locator(".nav-underline"),
    ).toBeVisible();
    await expect(nav.locator(".nav-underline")).toHaveCount(1);
  });

  test("buttons and badges lift on hover", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "hover needs a pointer");
    await openHome(page);
    await page.waitForTimeout(1800);

    const button = page.getByRole("link", { name: "See my work" });
    await expect(button).toHaveCSS("translate", "none");
    await button.hover();
    await expect(button).toHaveCSS("translate", "0px -2px");

    await page.locator("#stack").scrollIntoViewIfNeeded();
    const badge = page.locator("#stack .badge").first();
    await badge.hover();
    await expect(badge).toHaveCSS("translate", "0px -2px");
  });

  test("a project item zooms its screenshot, takes its main layer colour and sweeps the link", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "desktop", "hover needs a pointer");
    await openHome(page);
    await page.locator("#projects").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);

    // Culture Labs is mostly application-layer technology
    const card = page.locator("#projects .layout-cards article").first();
    await expect(card).toHaveAttribute("data-main-layer", "application");
    const frame = card.locator(".shot");
    const inner = card.locator(".shot-inner");
    const sweep = () =>
      card.locator(".link-sweep").evaluate((link) => getComputedStyle(link, "::after").transform);

    await page.mouse.move(2, 2);
    await expect(inner).toHaveCSS("transform", "none");
    expect(await sweep()).toBe("matrix(0, 0, 0, 1, 0, 0)");
    const rest = await frame.evaluate((el) => getComputedStyle(el).borderTopColor);

    await card.hover();
    await expect(inner).toHaveCSS("transform", "matrix(1.04, 0, 0, 1.04, 0, 0)");
    await expect.poll(sweep).toBe("matrix(1, 0, 0, 1, 0, 0)");
    const mainColour = await colourOfVar(card, "--main-fg");
    await expect(frame).toHaveCSS("border-top-color", mainColour);
    expect(mainColour).not.toBe(rest);

    // the featured block's own border takes the colour too
    const featured = page.locator("#projects .project-feature");
    await featured.hover();
    await expect(featured).toHaveCSS("border-top-color", await colourOfVar(featured, "--main-fg"));
  });

  test("focus rings take the colour of the layer or project they belong to", async ({ page }) => {
    await openHome(page);
    await page.waitForTimeout(1800);
    await page.keyboard.press("Tab");

    const layer = page.getByRole("button", { name: /^Data layer/ });
    await layer.focus();
    await expect(layer).toHaveCSS("outline-color", await colourOfVar(layer, "--layer-fg"));

    const featuredButton = page
      .locator("#projects .project-feature")
      .getByRole("link", { name: /Read case study/ });
    await featuredButton.focus();
    await expect(featuredButton).toHaveCSS(
      "outline-color",
      await colourOfVar(featuredButton, "--main-fg"),
    );
  });

  test("copy email: the icon turns into a check and back, and the button keeps its width", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await openHome(page);
    // the button's name changes while it says "Copied", so find it by position
    const button = page.locator("#contact button").first();
    await expect(button).toHaveAccessibleName("Copy email");
    const icon = button.locator(".icon-swap");
    const width = (await button.boundingBox())?.width;

    await expect(icon).toHaveAttribute("data-icon", "a");
    await button.click();
    await expect(icon).toHaveAttribute("data-icon", "b");
    await expect(icon.locator("svg").nth(1)).toHaveCSS("opacity", "1");
    await expect(icon.locator("svg").first()).toHaveCSS("opacity", "0");
    expect((await button.boundingBox())?.width).toBe(width);

    await expect(icon).toHaveAttribute("data-icon", "a", { timeout: 4000 });
    await expect(icon.locator("svg").first()).toHaveCSS("opacity", "1");
  });

  test("the theme toggle's sun and moon turn and cross-fade", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await openHome(page);
    // the toggle's label changes with the theme, so find it by its place in the header
    const toggle = page.locator('header button[aria-label^="Switch"]');
    await expect(toggle).toHaveAccessibleName("Switch to dark theme");
    const icon = toggle.locator(".icon-swap");

    await expect(icon).toHaveAttribute("data-icon", "a");
    const moon = icon.locator("svg").first();
    const sun = icon.locator("svg").nth(1);
    await expect(moon).toHaveCSS("opacity", "1");
    await expect(sun).toHaveCSS("opacity", "0");

    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    // mid-turn: the moon is partly rotated away
    await expect
      .poll(() => moon.evaluate((el) => getComputedStyle(el).rotate), {
        timeout: 2000,
      })
      .not.toBe("none");
    await expect(icon).toHaveAttribute("data-icon", "b");
    await expect(sun).toHaveCSS("opacity", "1");
    await expect(moon).toHaveCSS("opacity", "0");
  });
});

test.describe("interaction feedback with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("colours still change, but nothing moves", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "hover needs a pointer");
    await openHome(page);

    const button = page.getByRole("link", { name: "See my work" });
    await button.hover();
    await expect(button).toHaveCSS("translate", "none");

    await page.locator("#projects").scrollIntoViewIfNeeded();
    const card = page.locator("#projects .layout-cards article").first();
    await card.hover();
    await expect(card.locator(".shot-inner")).toHaveCSS("transform", "none");
    await expect(card.locator(".shot")).toHaveCSS(
      "border-top-color",
      await colourOfVar(card, "--main-fg"),
    );
  });
});

test.describe("placeholders until real assets exist", () => {
  test("a missing screenshot is a browser window with the name and layer stripes", async ({
    page,
  }) => {
    await openHome(page);
    for (const project of projects.filter((item) => item.screenshots.length === 0)) {
      const item = page
        .locator("#projects article")
        .filter({ has: page.getByRole("heading", { name: project.title }) });
      const frame = item.locator(".shot").first();

      await expect(frame.locator(".window-bar .window-dot")).toHaveCount(3);
      await expect(frame.locator(".placeholder-title")).toHaveText(project.title);
      await expect(frame).toContainText("TODO: screenshot");

      // one stripe per layer the project uses, each in that layer's colour
      const layers = [...new Set(project.stack.map((tech) => tech.layer))];
      const stripes = frame.locator(".layer-fill");
      await expect(stripes).toHaveCount(layers.length);
      const colours = await stripes.evaluateAll((els) =>
        els.map((el) => getComputedStyle(el).backgroundColor),
      );
      expect(new Set(colours).size).toBe(layers.length);
    }
  });

  test("a missing photo is the initials in a square with a four-colour border", async ({
    page,
  }) => {
    await openHome(page);
    const frame = page.locator("#about .layer-frame");
    const initials = site.name
      .split(" ")
      .map((word) => word[0])
      .join("");
    await expect(frame).toHaveText(initials);
    await expect(page.locator("#about")).toContainText("TODO: photo");

    const box = await frame.boundingBox();
    expect(Math.abs((box?.width ?? 0) - (box?.height ?? 1))).toBeLessThan(1); // a square

    const sides = await frame.evaluate((el) => {
      const style = getComputedStyle(el);
      return [
        style.borderTopColor,
        style.borderRightColor,
        style.borderBottomColor,
        style.borderLeftColor,
      ];
    });
    expect(new Set(sides).size).toBe(4); // one colour per layer
  });
});

test.describe("view transitions to the case study", () => {
  /** Record, for each view transition, which project elements get a morph animation */
  async function watchTransitions(page: Page) {
    await page.addInitScript(() => {
      const w = window as unknown as {
        __vt: { groups: string[] }[];
        __count: number;
      };
      w.__vt = [];
      const original = document.startViewTransition?.bind(document);
      if (!original) return;
      document.startViewTransition = ((callback?: ViewTransitionUpdateCallback) => {
        const transition = original(callback);
        const record = { groups: [] as string[] };
        w.__vt.push(record);
        transition.ready
          .then(() => {
            const names = new Set<string>();
            for (const animation of document.getAnimations()) {
              const target = (animation.effect as KeyframeEffect | null)?.pseudoElement;
              const match = target?.match(/^::view-transition-group\((project-[a-z-]+)\)/);
              if (match) names.add(match[1]);
            }
            record.groups = [...names];
          })
          .catch(() => {});
        return transition;
      }) as typeof document.startViewTransition;
    });
  }

  const lastGroups = (page: Page) =>
    page.evaluate(() => {
      const list = (window as unknown as { __vt: { groups: string[] }[] }).__vt;
      return list[list.length - 1]?.groups ?? [];
    });

  /** Scroll a list item to the top so its title and screenshot are on screen */
  const bringIntoView = (page: Page, selector: string) =>
    page.evaluate((query) => {
      const element = document.querySelector(query)!;
      window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 140);
    }, selector);

  test("the title and screenshot morph into the case study and back", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "the morph is checked at desktop size");
    await watchTransitions(page);
    await openHome(page);

    await bringIntoView(page, "#projects .project-feature");
    await page.waitForTimeout(900);
    await page
      .locator("#projects .project-feature")
      .getByRole("link", { name: /Read case study/ })
      .click();
    await page.waitForURL("**/projects/coheart");
    await expect
      .poll(() => lastGroups(page))
      .toEqual(expect.arrayContaining(["project-title-coheart", "project-shot-coheart"]));
    // the new page was scrolled to the top in the same commit, so its elements could pair up
    expect(await page.evaluate(() => window.scrollY)).toBe(0);

    await page.getByRole("link", { name: "Back to projects" }).click();
    await page.waitForURL("**/#projects");
    await expect
      .poll(() => lastGroups(page))
      .toEqual(expect.arrayContaining(["project-title-coheart", "project-shot-coheart"]));
  });

  test("a grid card morphs too", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "the morph is checked at desktop size");
    await watchTransitions(page);
    await openHome(page);

    await bringIntoView(page, "#projects .layout-cards article");
    await page.waitForTimeout(900);
    const slug = projects.filter((project) => !project.featured)[0].slug;
    await page
      .locator("#projects .layout-cards article")
      .first()
      .getByRole("link", { name: /Read case study/ })
      .click();
    await page.waitForURL(`**/projects/${slug}`);
    await expect
      .poll(() => lastGroups(page))
      .toEqual(expect.arrayContaining([`project-title-${slug}`, `project-shot-${slug}`]));
  });

  test("the browser Back button restores the scroll position", async ({ page }, info) => {
    // KNOWN ISSUE, not yet understood: this fails in most runs, with the page ending at
    // different scroll positions after Back. A manual run on its own restored it correctly,
    // so it is either a timing problem in this test or real flakiness in Next's scroll
    // restoration with smooth scrolling. Investigate before relying on Back-button scroll.
    test.fixme(true, "scroll position after Back is unreliable; see comment");
    test.skip(info.project.name !== "desktop", "checked at desktop size");
    await openHome(page);
    const link = page
      .locator("#projects .layout-cards article")
      .first()
      .getByRole("link", { name: /Read case study/ });
    await link.scrollIntoViewIfNeeded();

    // the page scrolls smoothly, so wait until it has stopped before recording the position
    const scrollY = () => page.evaluate(() => Math.round(window.scrollY));
    await expect
      .poll(async () => {
        const first = await scrollY();
        await page.waitForTimeout(300);
        return first === (await scrollY());
      })
      .toBe(true);
    const before = await scrollY();
    expect(before).toBeGreaterThan(1000); // really somewhere down the page

    await link.click();
    await page.waitForURL("**/projects/**");
    await page.goBack();
    await page.waitForFunction(() => window.location.pathname === "/");
    await expect.poll(scrollY).toBe(before);
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("navigation works and no view-transition animation runs", async ({ page }, info) => {
      test.skip(info.project.name !== "desktop", "checked at desktop size");
      await openHome(page);
      await page.evaluate(() => {
        const w = window as unknown as { __vtAnimations: number };
        w.__vtAnimations = 0;
        const original = document.startViewTransition.bind(document);
        document.startViewTransition = ((callback?: ViewTransitionUpdateCallback) => {
          const transition = original(callback);
          transition.ready
            .then(() => {
              for (const animation of document.getAnimations()) {
                const target = (animation.effect as KeyframeEffect | null)?.pseudoElement;
                if (
                  target?.startsWith("::view-transition-") &&
                  animation.playState === "running" &&
                  Number(animation.effect?.getComputedTiming().duration) > 0
                ) {
                  w.__vtAnimations++;
                }
              }
            })
            .catch(() => {});
          return transition;
        }) as typeof document.startViewTransition;
      });

      await bringIntoView(page, "#projects .layout-cards article");
      await page.waitForTimeout(500);
      await page
        .locator("#projects .layout-cards article")
        .first()
        .getByRole("link", { name: /Read case study/ })
        .click();
      await page.waitForURL("**/projects/**");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.waitForTimeout(600);
      expect(
        await page.evaluate(() => (window as unknown as { __vtAnimations: number }).__vtAnimations),
      ).toBe(0);
    });
  });
});

test.describe("request trace", () => {
  test("a dot loops through the layers and the layers pulse", async ({ page }) => {
    await openHome(page);
    const dot = page.locator(".trace-dot");
    await expect(dot).toBeVisible();
    await expect(dot).toHaveCSS("animation-name", /trace-move/);
    await expect(dot).toHaveCSS("animation-iteration-count", /infinite/);
    await expect(page.locator(".layer-pulse")).toHaveCount(4);
    await expect(page.locator(".trace-pulse-3")).toHaveCSS("animation-name", "trace-pulse-3");
  });

  test("pauses when the diagram is off screen or the tab is hidden", async ({ page }) => {
    await openHome(page);
    const diagram = page.locator(".stack-trace");
    await expect(diagram).toHaveAttribute("data-trace", "running");

    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(diagram).toHaveAttribute("data-trace", "paused");
    await expect(page.locator(".trace-dot")).toHaveCSS("animation-play-state", /paused/);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(diagram).toHaveAttribute("data-trace", "running");

    await page.evaluate(() => {
      Object.defineProperty(document, "hidden", {
        value: true,
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await expect(diagram).toHaveAttribute("data-trace", "paused");
  });
});

test.describe("layer highlight", () => {
  const stackBadge = (page: Page, layer: string) =>
    page.locator(`#stack [data-layer="${layer}"] .badge`).first();

  test("hovering a diagram layer dims the others", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "hover needs a pointer");
    await openHome(page);
    await page.waitForTimeout(1800);

    const layers = page.locator(".diagram-layer");
    await page.locator('.diagram-layer[data-layer="data"]').hover();
    await expect(layers.nth(0)).toHaveCSS("opacity", "0.45");
    await expect(layers.nth(2)).toHaveCSS("opacity", "1");
    await page.mouse.move(2, 2);
    await expect(layers.nth(0)).toHaveCSS("opacity", "1");
  });

  test("layers are buttons: keyboard focus dims the others and Enter selects", async ({ page }) => {
    await openHome(page);
    await page.waitForTimeout(1800);

    const application = page.getByRole("button", {
      name: /^Application layer/,
    });
    await application.focus();
    await expect(page.locator(".diagram-layer").nth(0)).toHaveCSS("opacity", "0.45");
    await expect(application).toHaveAttribute("aria-pressed", "false");
    await page.keyboard.press("Enter");
    await expect(application).toHaveAttribute("aria-pressed", "true");
  });

  test("the legend highlights a layer's tags in every section and clears", async ({ page }) => {
    await openHome(page);

    const wrapper = page.locator("div.contents").first();
    const projectsLegend = page
      .locator("#projects")
      .getByRole("button", { name: "Application", exact: true });
    const experienceLegend = page
      .locator("#experience")
      .getByRole("button", { name: "Application", exact: true });

    await projectsLegend.click();
    await expect(wrapper).toHaveAttribute("data-highlight", "application");
    await expect(projectsLegend).toHaveAttribute("aria-pressed", "true");
    await expect(experienceLegend).toHaveAttribute("aria-pressed", "true");

    // tags of the selected layer stay solid; the rest fade, in Stack, Projects and Experience
    await expect(stackBadge(page, "application")).toHaveCSS("opacity", "1");
    await expect(stackBadge(page, "data")).toHaveCSS("opacity", "0.3");
    await expect(page.locator('#projects .badge[data-layer="interface"]').first()).toHaveCSS(
      "opacity",
      "0.3",
    );
    await expect(page.locator('#experience .badge[data-layer="application"]').first()).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(page.locator('#experience .badge[data-layer="data"]').first()).toHaveCSS(
      "opacity",
      "0.3",
    );

    // the change is announced, since the dimming is only visual
    await expect(
      page.getByRole("status").filter({ hasText: "Highlighting application" }),
    ).toBeAttached();

    // selecting it again clears everything
    await projectsLegend.click();
    await expect(wrapper).not.toHaveAttribute("data-highlight", /.+/);
    await expect(stackBadge(page, "data")).toHaveCSS("opacity", "1");
    await expect(page.getByRole("status").filter({ hasText: "Highlight cleared" })).toBeAttached();
  });

  test("selecting a diagram layer and the legend share one state, not the URL", async ({
    page,
  }) => {
    await openHome(page);
    await page.waitForTimeout(1800);
    const url = page.url();

    await page.getByRole("button", { name: /^Infrastructure layer/ }).click();
    await expect(
      page.locator("#experience").getByRole("button", {
        name: "Infrastructure",
        exact: true,
      }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(page.url()).toBe(url);

    // choosing another layer replaces the selection
    await page.locator("#projects").getByRole("button", { name: "Data", exact: true }).click();
    await expect(page.getByRole("button", { name: /^Infrastructure layer/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await expect(page.getByRole("button", { name: /^Data layer/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("nothing animates and everything is in its final state at once", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // no request trace at all with reduced motion: the dot never appears and there is no Pause
    await expect(page.locator(".stack-dot")).toHaveAttribute("opacity", "0");
    await expect(page.locator(".stage-toggle")).toBeHidden();

    for (const selector of [".plate-drop", ".circuit-trace", ".name-letter"]) {
      await expect(page.locator(selector).first()).toHaveCSS("animation-name", "none");
    }
    const layers = page.locator(LAYERS);
    await expect(layers).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(layers.nth(i)).toHaveCSS("opacity", "1");
    }
    await expect(page.locator(".name-letter").first()).toHaveCSS("font-stretch", "116%");

    // no scroll effects: nothing hidden, no progress bar, timeline complete
    await expect(page.locator("[data-reveal-state]")).toHaveCount(0);
    await expect(page.locator(".scroll-progress")).toBeHidden();
    await expect(page.locator("[data-timeline]")).not.toHaveAttribute("data-timeline", "active");
    const timeline = await page.evaluate(() => {
      const list = document.querySelector("[data-timeline]") as HTMLElement;
      return {
        line: getComputedStyle(list, "::after").transform,
        dots: [...list.querySelectorAll(".timeline-item")].map(
          (item) => getComputedStyle(item, "::before").backgroundColor,
        ),
      };
    });
    expect(timeline.line).toBe("matrix(1, 0, 0, 1, 0, 0)");
    expect(new Set(timeline.dots).size).toBe(1); // every dot filled with the same colour
    for (const selector of ["#stack .layer-band", "#experience .timeline-item"]) {
      await expect(page.locator(selector).first()).toHaveCSS("opacity", "1");
    }
  });
});

test.describe("reduced motion, everywhere", () => {
  test.use({ reducedMotion: "reduce" });

  test("no animation or transition exists anywhere on the page", async ({ page }) => {
    await openHome(page);
    await page.waitForTimeout(2000);
    await scrollThrough(page);

    const running = await page.evaluate(() => document.getAnimations().length);
    expect(running).toBe(0);
    await expect(page.locator("[data-reveal-state]")).toHaveCount(0);
    await expect(page.locator(".trace-dot")).toBeHidden();
    await expect(page.locator(".scroll-progress")).toBeHidden();
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the content and the diagram are in the page and visible", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(site.name);
    await expect(page.getByText(site.now)).toBeVisible();
    for (const item of site.nav) {
      await expect(page.locator(`#${item.id}`)).toBeAttached();
    }

    // the load animation is CSS, so it still plays; once it ends everything is visible
    await page.waitForTimeout(2200);
    const layers = page.locator(LAYERS);
    await expect(layers).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(layers.nth(i)).toHaveCSS("opacity", "1");
    }
    await expect(page.locator("#contact")).toContainText(site.links.email);

    // nothing is hidden for a reveal, and the scroll-driven pieces are in their final state
    await expect(page.locator("[data-reveal-state]")).toHaveCount(0);
    for (const selector of [
      "#stack .layer-band",
      '#projects [data-reveal="slide-left"]',
      "#experience .timeline-item",
      "#about [data-reveal]",
      "#contact [data-reveal]",
    ]) {
      await expect(page.locator(selector).first()).toHaveCSS("opacity", "1");
    }
    await expect(page.locator(".scroll-progress")).toHaveCSS("opacity", "0");
    const line = await page.evaluate(() => {
      const list = document.querySelector("[data-timeline]") as HTMLElement;
      return getComputedStyle(list, "::after").transform;
    });
    expect(line).toBe("matrix(1, 0, 0, 1, 0, 0)");
  });

  test("is already visible when the first frame is painted", async ({ page }) => {
    await page.goto("/", { waitUntil: "commit" });
    // before any animation has run, the base styles must be the visible ones
    await page.waitForSelector(LAYERS, { state: "attached" });
    const base = await page.evaluate((selector) => {
      const element = document.querySelector(selector) as HTMLElement;
      element.getAnimations().forEach((animation) => animation.cancel());
      return getComputedStyle(element).opacity;
    }, LAYERS);
    expect(base).toBe("1");
  });
});
