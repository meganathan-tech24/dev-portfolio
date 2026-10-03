"use client";

import { useEffect, useRef } from "react";

/**
 * Pauses the request-trace animation (CSS) while the tab is hidden or the
 * diagram is off screen. Renders nothing; it marks the closest `[data-trace]`
 * element as "paused" or "running". Without JavaScript the trace simply keeps running.
 */
export function TraceController() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const target = marker.current?.closest<HTMLElement>("[data-trace]");
    if (!target) return;

    let inView = true;
    let tabVisible = !document.hidden;

    const update = () => {
      target.dataset.trace = inView && tabVisible ? "running" : "paused";
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(target);

    const onVisibility = () => {
      tabVisible = !document.hidden;
      update();
    };
    document.addEventListener("visibilitychange", onVisibility);
    update();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <span ref={marker} hidden />;
}
