"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const subscribe = () => () => {};

/**
 * next-themes switches off all CSS transitions for a moment while the theme changes
 * (disableTransitionOnChange). The icon waits this long, so its turn can be seen.
 */
const ICON_DELAY = 60;

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // false on the server and during hydration, true afterwards
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const isDark = mounted && resolvedTheme === "dark";

  // null until mounted; then it follows the theme
  const [iconDark, setIconDark] = useState<boolean | null>(null);
  useEffect(() => {
    if (!mounted) return;
    const first = iconDark === null;
    const timer = setTimeout(() => setIconDark(isDark), first ? 0 : ICON_DELAY);
    return () => clearTimeout(timer);
  }, [mounted, isDark, iconDark]);

  // Before the page has mounted the theme is not known to React, so the icon is picked by CSS
  // from the `dark` class that next-themes sets before the first paint. That keeps the button
  // the same size and showing the right icon, never an empty box. After mount the icons take
  // their state and animate on change. Both versions render identical markup on the server
  // and on the client's first render, so there is no hydration mismatch.
  const mountedIcons = iconDark !== null;

  return (
    <button
      type="button"
      className={cn("btn btn-secondary btn-icon", className)}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span
        className="icon-swap size-5"
        data-icon={mountedIcons ? (iconDark ? "b" : "a") : undefined}
      >
        <Moon aria-hidden="true" className={mountedIcons ? undefined : "dark:hidden"} />
        <Sun aria-hidden="true" className={mountedIcons ? undefined : "hidden dark:block"} />
      </span>
    </button>
  );
}
