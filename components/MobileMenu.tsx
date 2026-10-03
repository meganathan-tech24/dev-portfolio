"use client";

import { Mail } from "lucide-react";
import * as m from "motion/react-m";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { GitHubIcon } from "@/components/ui/GitHubIcon";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";
import { SectionMark } from "@/components/ui/SectionMark";
import { site } from "@/data/site";
import { isTodo } from "@/lib/utils";

const FOCUSABLE = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

type MobileMenuProps = {
  /** Id of the section that is currently active, if any */
  active: string | null;
  /** `restoreFocus` is true when closing with Escape, so focus goes back to the menu button */
  onClose: (restoreFocus: boolean) => void;
};

const list = {
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};

/**
 * The full-screen menu for phones. While it is open: body scroll is locked, the page behind
 * it is inert (not reachable by keyboard or screen reader), Tab stays inside the header and
 * the menu, and Escape or a link click closes it. It is mounted only while open.
 */
export function MobileMenu({ active, onClose }: MobileMenuProps) {
  const panel = useRef<HTMLDivElement>(null);
  const { links } = site;

  useEffect(() => {
    const root = document.documentElement;
    const behind = [document.getElementById("main"), document.querySelector("footer")];

    root.classList.add("menu-open");
    for (const element of behind) element?.setAttribute("inert", "");
    panel.current?.querySelector<HTMLElement>("a[href]")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose(true);
        return;
      }
      if (event.key !== "Tab") return;

      // Tab cycles through the header's controls and then the menu's, and wraps around
      const header = document.querySelector("header");
      const focusable = [
        ...(header?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
        ...(panel.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
      ].filter((element) => element.offsetParent !== null || element === document.activeElement);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);

    // The menu button disappears from md up, so close the menu if the screen grows
    const wide = window.matchMedia("(min-width: 768px)");
    const onResize = () => {
      if (wide.matches) onClose(false);
    };
    wide.addEventListener("change", onResize);

    return () => {
      root.classList.remove("menu-open");
      for (const element of behind) element?.removeAttribute("inert");
      document.removeEventListener("keydown", onKeyDown);
      wide.removeEventListener("change", onResize);
    };
  }, [onClose]);

  return (
    <m.div
      ref={panel}
      id="mobile-menu"
      role="dialog"
      aria-label="Menu"
      className="mobile-menu glass-strong"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <nav aria-label="Main mobile">
        <m.ul variants={list} initial="hidden" animate="show" className="grid gap-5">
          {site.nav.map((navItem) => (
            <m.li key={navItem.id} variants={item}>
              <Link
                href={`/#${navItem.id}`}
                className="menu-link type-h2"
                aria-current={active === navItem.id ? "location" : undefined}
                onClick={() => {
                  // unlock now, so the jump to the section is not blocked by the scroll lock
                  document.documentElement.classList.remove("menu-open");
                  onClose(false);
                }}
              >
                <SectionMark mark={navItem.mark} direction="vertical" />
                {navItem.label}
              </Link>
            </m.li>
          ))}
        </m.ul>
      </nav>

      <div className="grid gap-4">
        <ul className="flex flex-wrap gap-3">
          <li>
            <Button
              href={`mailto:${links.email}`}
              variant="secondary"
              className="btn-icon"
              aria-label="Send an email"
            >
              <Mail aria-hidden="true" className="size-5" />
            </Button>
          </li>
          {!isTodo(links.linkedin) ? (
            <li>
              <Button
                href={links.linkedin}
                variant="secondary"
                className="btn-icon"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </Button>
            </li>
          ) : null}
          {!isTodo(links.github) ? (
            <li>
              <Button
                href={links.github}
                variant="secondary"
                className="btn-icon"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </Button>
            </li>
          ) : null}
        </ul>
      </div>
    </m.div>
  );
}
