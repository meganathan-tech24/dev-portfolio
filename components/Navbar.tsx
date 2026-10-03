"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LayerStrip } from "@/components/LayerStrip";
import { MobileMenu } from "@/components/MobileMenu";
import { LayerMark } from "@/components/ui/LayerMark";
import { SectionMark } from "@/components/ui/SectionMark";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { site } from "@/data/site";
import type { NavItem as NavItemData } from "@/data/types";

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
          setActive((current) => (entry.isIntersecting ? id : current === id ? null : current));
        }
      },
      // A section counts as active while it crosses a band near the top third
      { rootMargin: "-30% 0px -60% 0px" },
    );

    for (const id of sectionIds) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    // The last section is short, so it may never reach the band above: once the footer has
    // come up into the lower part of the screen, treat the last section as the active one
    const footer = document.querySelector("footer");
    const bottomObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(sectionIds[sectionIds.length - 1]);
      },
      { rootMargin: "0px 0px -30% 0px" },
    );
    if (footer) bottomObserver.observe(footer);

    return () => {
      observer.disconnect();
      bottomObserver.disconnect();
    };
  }, [enabled]);

  return enabled ? active : null;
}

type NavItemProps = {
  item: NavItemData;
  active: boolean;
};

function NavItem({ item, active }: NavItemProps) {
  return (
    <Link
      href={`/#${item.id}`}
      className="nav-link"
      data-active={active}
      aria-current={active ? "location" : undefined}
    >
      {item.label}
      {active ? (
        // One shared element slides from link to link; it wears the section's colour
        <m.span
          layoutId="nav-underline"
          aria-hidden="true"
          className="nav-underline"
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <SectionMark mark={item.mark} direction="horizontal" />
        </m.span>
      ) : null}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const active = useActiveSection(pathname === "/");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  // "Meganathan" on its own below lg, the full name from lg
  const [firstName, ...otherNames] = site.name.split(" ");

  const closeMenu = useCallback((restoreFocus: boolean) => {
    setMenuOpen(false);
    if (restoreFocus) menuButton.current?.focus();
  }, []);

  // Clicking the name scrolls to the top when already on the home page
  const onBrandClick = (event: React.MouseEvent) => {
    if (pathname !== "/") return;
    event.preventDefault();
    // back to the top also means no section in the address bar any more
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    // "auto" follows the page's scroll-behavior: smooth only when motion is allowed
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <>
      <header className="site-header glass-strong">
        <a
          href="#main"
          className="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
        >
          Skip to content
        </a>

        <LayerStrip activeId={active} />

        <div className="container-page flex h-15 items-center justify-between gap-4">
          <Link
            href="/"
            className="header-brand"
            aria-label={`${site.name}, back to the top`}
            onClick={onBrandClick}
          >
            <LayerMark showInitials={false} />
            <span className="header-name">
              {firstName}
              <span className="hidden lg:inline"> {otherNames.join(" ")}</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
              {site.nav.map((item) => (
                <NavItem key={item.id} item={item} active={active === item.id} />
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                ref={menuButton}
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
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? <MobileMenu active={active} onClose={closeMenu} /> : null}
      </AnimatePresence>
    </>
  );
}
