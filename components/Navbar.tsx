"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const sectionIds = site.nav.map((item) => item.id);

/** Id of the section nearest the top of the viewport, or null above the first one */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          setActive((current) =>
            entry.isIntersecting ? id : current === id ? null : current,
          );
        }
      },
      // A section counts as active while it crosses a band near the top third
      { rootMargin: "-30% 0px -60% 0px" },
    );

    for (const id of sectionIds) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    // The last section is short, so it may never reach the band above: treat
    // "footer fully visible" (scrolled to the bottom) as the last section
    const footer = document.querySelector("footer");
    const bottomObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(sectionIds[sectionIds.length - 1]);
      },
      { threshold: 1 },
    );
    if (footer) bottomObserver.observe(footer);

    return () => {
      observer.disconnect();
      bottomObserver.disconnect();
    };
  }, [enabled]);

  return enabled ? active : null;
}

export function Navbar() {
  const pathname = usePathname();
  const active = useActiveSection(pathname === "/");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      <a
        href="#main"
        className="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
      >
        Skip to content
      </a>

      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-display text-lg font-bold">
          {site.name}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.id}
              href={`/#${item.id}`}
              className="nav-link"
              data-active={active === item.id}
              aria-current={active === item.id ? "location" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            className="btn btn-secondary btn-icon md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <m.nav
            id="mobile-menu"
            aria-label="Main mobile"
            className="nav-mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {site.nav.map((item) => (
              <Link
                key={item.id}
                href={`/#${item.id}`}
                className="nav-link"
                data-active={active === item.id}
                aria-current={active === item.id ? "location" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </m.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
