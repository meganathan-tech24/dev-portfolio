import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { projects } from "../data/projects";
import { site } from "../data/site";

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.describe("page loads", () => {
  test("home page has the name, one h1 and no console errors", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/");

    await expect(page).toHaveTitle(site.seo.title);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(site.name);
    for (const item of site.nav) {
      await expect(page.locator(`#${item.id}`)).toBeAttached();
    }
    expect(errors).toEqual([]);
  });

  test("has no horizontal scroll", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });

  for (const project of projects) {
    test(`case study /projects/${project.slug} loads`, async ({ page }) => {
      const response = await page.goto(`/projects/${project.slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        project.title,
      );
      await expect(page).toHaveTitle(new RegExp(project.title));
    });
  }

  test("an unknown project is a 404 with a way home", async ({ page }) => {
    const response = await page.goto("/projects/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Go to the home page" }),
    ).toBeVisible();
  });
});

test.describe("navigation", () => {
  test("desktop nav links go to their sections", async ({ page }, info) => {
    test.skip(
      info.project.name !== "desktop",
      "desktop nav is hidden on mobile",
    );
    await page.goto("/");

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

  test("mobile menu opens, navigates and closes with Escape", async ({
    page,
  }, info) => {
    test.skip(
      info.project.name !== "mobile",
      "mobile menu only exists on mobile",
    );
    await page.goto("/");

    const button = page.getByRole("button", { name: "Open menu" });
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await button.click();

    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Close menu" }),
    ).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();

    await page.getByRole("button", { name: "Open menu" }).click();
    await menu.getByRole("link", { name: "Contact" }).click();
    await expect(menu).toHaveCount(0);
    await expect(page.locator("#contact")).toBeInViewport();
  });

  test("skip link is the first tab stop and jumps to main", async ({
    page,
  }) => {
    await page.goto("/");
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
        await page.goto("/");
        const html = page.locator("html");
        if (scheme === "dark") await expect(html).toHaveClass(/dark/);
        else await expect(html).not.toHaveClass(/dark/);
      });
    });
  }

  test("toggle switches theme, updates its label and persists", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");

    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);

    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(html).toHaveClass(/dark/);
    await expect(
      page.getByRole("button", { name: "Switch to light theme" }),
    ).toBeVisible();

    await page.reload();
    await expect(html).toHaveClass(/dark/);

    await page.getByRole("button", { name: "Switch to light theme" }).click();
    await expect(html).not.toHaveClass(/dark/);
  });
});

test.describe("contact", () => {
  test("copy email copies the address and confirms", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");

    const contact = page.locator("#contact");
    await expect(
      contact.getByText(site.links.email, { exact: true }),
    ).toBeVisible();

    await contact.getByRole("button", { name: "Copy email" }).click();
    await expect(contact.getByRole("button", { name: "Copied" })).toBeVisible();
    await expect(contact.getByRole("status")).toHaveText(
      "Email address copied to the clipboard",
    );

    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toBe(site.links.email);

    await expect(
      contact.getByRole("button", { name: "Copy email" }),
    ).toBeVisible({ timeout: 4000 });
  });

  test("mailto and external links are set up safely", async ({ page }) => {
    await page.goto("/");
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
          // let the one-time diagram animation finish so contrast is measured on final colours
          await page.waitForTimeout(1000);

          const results = await new AxeBuilder({ page })
            .withTags(AXE_TAGS)
            .analyze();
          expect(results.violations).toEqual([]);
        });
      }
    });
  }

  test("mobile menu has no violations when open", async ({ page }, info) => {
    test.skip(
      info.project.name !== "mobile",
      "mobile menu only exists on mobile",
    );
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    await page.waitForTimeout(400);

    const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the stack diagram is visible straight away", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const layers = page.locator("figure > div > div");
    await expect(layers).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(layers.nth(i)).toHaveCSS("opacity", "1");
    }
  });
});
