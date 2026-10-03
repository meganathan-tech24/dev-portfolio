"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

/** Share of the viewport height, from the top, where the tip of the timeline line stays */
const TIMELINE_TIP_AT = 0.5;

/** Elements starting this close to the bottom of the first screen count as already in view */
const IN_VIEW_AT = 0.92;

/**
 * Everything on the page that depends on scrolling:
 * - one-time reveals for `[data-reveal]` elements that start below the fold
 * - the experience timeline line and its dots
 *
 * Nothing is hidden on the server. Hiding happens here, after hydration, and only
 * for elements that are not on screen yet, so without JavaScript the page is complete.
 * With reduced motion this does nothing and everything stays in its final state.
 */
export function ScrollEffects() {
  const pathname = usePathname();

  // A view transition captures the new page when this commit finishes, but Next only
  // resets the scroll afterwards. Without this the new page is still scrolled to the old
  // position, its title and screenshot are off screen, and they cannot morph from the
  // list. So on a client-side navigation, scroll in the same commit: to the top of a case
  // study, or to the section named in the link (the back link goes to /#projects).
  // The first render is skipped, so reloading keeps the browser's own scroll restoration.
  const previousPath = useRef<string | null>(null);
  useLayoutEffect(() => {
    const cameFrom = previousPath.current;
    previousPath.current = pathname;
    if (cameFrom === null || cameFrom === pathname) return;

    const target = window.location.hash ? document.querySelector(window.location.hash) : null;
    if (target) target.scrollIntoView({ behavior: "instant" });
    else if (pathname.startsWith("/projects/")) window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const timeline = document.querySelector<HTMLElement>("[data-timeline]");
    const items = timeline
      ? Array.from(timeline.querySelectorAll<HTMLElement>(".timeline-item"))
      : [];

    // --- one-time reveals ---
    const viewport = window.innerHeight;
    const pending = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
      (element) => element.getBoundingClientRect().top > viewport * IN_VIEW_AT,
    );

    for (const element of pending) element.dataset.revealState = "hidden";
    // flush styles so the change to "shown" later is animated
    void root.offsetHeight;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealState = "shown";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const element of pending) observer.observe(element);

    // --- animated card borders: pause them while the card is off screen ---
    const flowObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.toggleAttribute("data-offscreen", !entry.isIntersecting);
        }
      },
      { rootMargin: "120px" },
    );
    const flows = Array.from(document.querySelectorAll<HTMLElement>(".border-flow"));
    for (const flow of flows) flowObserver.observe(flow);

    // --- scroll-linked: the experience timeline ---
    // `data-timeline` only marks the list (it is how this effect finds it), so it is never
    // changed here: React runs effects twice in development, and the second run must find it.

    let frame = 0;
    let lastTimeline = -1;

    const update = () => {
      frame = 0;

      if (timeline) {
        // The line is drawn from `lineTop` (the first dot) to the bottom of the list, growing
        // downward (transform-origin: top). Its tip follows a fixed height in the viewport.
        const box = timeline.getBoundingClientRect();
        const lineTop = parseFloat(getComputedStyle(timeline, "::after").top) || 0;
        const lineHeight = box.height - lineTop;
        const tip = window.innerHeight * TIMELINE_TIP_AT - box.top; // from the top of the list
        const drawn = Math.min(lineHeight, Math.max(0, tip - lineTop));

        if (tip !== lastTimeline) {
          lastTimeline = tip;
          timeline.style.setProperty(
            "--timeline-progress",
            (lineHeight > 0 ? drawn / lineHeight : 0).toFixed(4),
          );
          // A dot fills when the tip passes its centre and stays filled: scrolling back up
          // shrinks the line but never empties a dot that was reached
          for (const item of items) {
            if (item.hasAttribute("data-reached")) continue;
            const dot = getComputedStyle(item, "::before");
            const dotCentre = item.offsetTop + parseFloat(dot.top) + parseFloat(dot.height) / 2;
            if (dotCentre <= tip) item.setAttribute("data-reached", "");
          }
        }
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      flowObserver.disconnect();
      for (const flow of flows) flow.removeAttribute("data-offscreen");
      for (const element of pending) delete element.dataset.revealState;
      if (timeline) {
        timeline.style.removeProperty("--timeline-progress");
        for (const item of items) item.removeAttribute("data-reached");
      }
    };
  }, [pathname]);

  return null;
}
