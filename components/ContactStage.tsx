"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { site } from "@/data/site";

type CopyStatus = "idle" | "copied" | "failed";

type ContactContext = {
  copied: boolean;
  /** Counts successful copies, so the "delivered" animation can start again each time */
  sent: number;
  copy: () => void;
};

const Context = createContext<ContactContext | null>(null);

/** Copy state and action shared by the big email and the C shortcut */
export function useContactCopy() {
  const context = useContext(Context);
  if (!context) throw new Error("useContactCopy must be used inside ContactStage");
  return context;
}

const FEEDBACK_MS = 2200;

/** True while a text field or editable element has focus (the C shortcut must stay out of it) */
function isTyping(element: Element | null) {
  if (!(element instanceof HTMLElement)) return false;
  return /^(input|textarea|select)$/i.test(element.tagName) || element.isContentEditable;
}

/**
 * The "Get in touch" section shell. It marks the section `data-in` once it has entered the
 * viewport (the headline animation, CSS) and `data-active` while it is on screen (pauses the
 * traces otherwise), moves the cursor grid with a mouse, owns the copy action with its toast,
 * and listens for the C key while the section is in view.
 */
export function ContactStage({
  id,
  labelledBy,
  children,
}: {
  id: string;
  labelledBy: string;
  children: ReactNode;
}) {
  const section = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inView = useRef(false);
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<CopyStatus>("idle");
  const [sent, setSent] = useState(0);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(site.links.email);
      setStatus("copied");
      setSent((count) => count + 1);
    } catch {
      setStatus("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), FEEDBACK_MS);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    const element = section.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        element.dataset.active = String(entry.isIntersecting);
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) element.dataset.in = "";
      },
      { threshold: [0, 0.3] },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "c" || event.repeat) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (!inView.current || isTyping(document.activeElement)) return;
      void copy();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [copy]);

  // The cursor grid follows a mouse; touch and reduced motion get the static grid
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== "mouse" || !section.current) return;
    const bounds = section.current.getBoundingClientRect();
    section.current.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    section.current.style.setProperty("--my", `${event.clientY - bounds.top}px`);
  };

  const value = useMemo(() => ({ copied: status === "copied", sent, copy }), [status, sent, copy]);
  const message =
    status === "copied"
      ? site.contact.toastCopied
      : status === "failed"
        ? site.contact.toastFailed
        : null;

  return (
    <Context.Provider value={value}>
      <section
        ref={section}
        id={id}
        aria-labelledby={labelledBy}
        onPointerMove={onPointerMove}
        className="contact-stage"
      >
        {children}
      </section>

      {/* Always in the page, so the text is announced when it appears */}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-7 z-50 flex justify-center px-4"
      >
        <AnimatePresence>
          {message ? (
            <m.p
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="contact-toast"
            >
              {message}
            </m.p>
          ) : null}
        </AnimatePresence>
      </div>
    </Context.Provider>
  );
}
