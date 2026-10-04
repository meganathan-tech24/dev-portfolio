"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { skillGroups } from "@/data/skills";

export type Direction = "request" | "response";

type HeroContext = {
  /** Layer index (0 = interface) the whole hero shows: hovered, else the one the request is in */
  active: number;
  /** Layer index being hovered or focused, or -1 */
  hover: number;
  setHover: (index: number) => void;
  /** Whether the request is on its way down or coming back up */
  direction: Direction;
  setDirection: (direction: Direction) => void;
  /** Called by the request dot when it reaches a layer: that layer becomes the request's layer and its traces send a pulse */
  arrive: (index: number) => void;
  /** Per layer, how many times the request has arrived there (a new value restarts its pulse) */
  pulses: number[];
  /** The visitor pressed Pause */
  paused: boolean;
  togglePaused: () => void;
  /** False while paused, while the tab is hidden or while the hero is off screen */
  isRunning: () => boolean;
};

const Context = createContext<HeroContext | null>(null);

export function useHero() {
  const context = useContext(Context);
  if (!context) throw new Error("useHero must be used inside HeroState");
  return context;
}

/**
 * The hero section, and the one place that knows which layer the hero is showing. The dot, the
 * plates, the layer cards, the role label, "Layer N of 4" and the Request/Response tag all read
 * `active` from here, so they can never show different layers. It also marks the section
 * `data-trace="paused"` while the tab is hidden or the hero is off screen, which freezes the
 * pulses (the dot checks `isRunning`).
 */
export function HeroState({ children }: { children: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const pausedRef = useRef(false);
  const [request, setRequest] = useState(0);
  const [hover, setHover] = useState(-1);
  const [direction, setDirection] = useState<Direction>("request");
  const [pulses, setPulses] = useState(() => skillGroups.map(() => 0));
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = section.current;
    if (!element) return;

    let inView = true;
    let tabVisible = !document.hidden;
    const update = () => {
      element.dataset.trace = inView && tabVisible ? "running" : "paused";
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(element);

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

  const isRunning = useCallback(
    () => !pausedRef.current && section.current?.dataset.trace !== "paused",
    [],
  );

  const arrive = useCallback((index: number) => {
    setRequest(index);
    setPulses((current) => current.map((count, layer) => (layer === index ? count + 1 : count)));
  }, []);

  const togglePaused = useCallback(() => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  }, []);

  const value = useMemo(
    () => ({
      active: hover >= 0 ? hover : request,
      hover,
      setHover,
      direction,
      setDirection,
      arrive,
      pulses,
      paused,
      togglePaused,
      isRunning,
    }),
    [hover, request, direction, arrive, pulses, paused, togglePaused, isRunning],
  );

  return (
    <Context.Provider value={value}>
      <section
        ref={section}
        id="hero"
        aria-labelledby="hero-heading"
        data-trace="running"
        className="hero-shell"
      >
        {children}
      </section>
    </Context.Provider>
  );
}
