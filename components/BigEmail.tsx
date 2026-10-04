"use client";

import { Check, Copy } from "lucide-react";
import {
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState, type PointerEvent, type RefObject } from "react";
import { useContactCopy } from "@/components/ContactStage";
import { skillGroups } from "@/data/skills";
import { site } from "@/data/site";

/** How far (px) the cursor reaches letters, and how high a letter rises at full reach */
const REACH = 150;
const RISE = 8;
const FAR = -9999;
const SPRING = { stiffness: 320, damping: 26, mass: 0.5 };

type LetterProps = {
  char: string;
  layer: (typeof skillGroups)[number]["layer"];
  box: RefObject<HTMLElement | null>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** Changes whenever the letters should be measured again (the pointer enters the address) */
  tick: MotionValue<number>;
};

/**
 * One letter of the address. Its closeness to the cursor (0 to 1) lifts it, grows it a little
 * and fades its colour towards its layer's colour. Transform and a colour variable only, so
 * no letter ever moves its neighbours.
 */
function Letter({ char, layer, box, x, y, tick }: LetterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // Far away until measured, so a letter that has not been measured never lights up
  const cx = useMotionValue(-FAR);
  const cy = useMotionValue(-FAR);

  // Centre of the letter relative to the address box, measured on mount, on resize and each
  // time the pointer enters the address
  useEffect(() => {
    const measure = () => {
      const letter = ref.current;
      const parent = box.current;
      if (!letter || !parent) return;
      const a = letter.getBoundingClientRect();
      const b = parent.getBoundingClientRect();
      cx.set(a.left - b.left + a.width / 2);
      cy.set(a.top - b.top + a.height / 2);
    };
    measure();
    window.addEventListener("resize", measure);
    const stop = tick.on("change", measure);
    return () => {
      window.removeEventListener("resize", measure);
      stop();
    };
  }, [box, cx, cy, tick]);

  const near = useTransform([x, y, cx, cy], ([px, py, lx, ly]: number[]) =>
    Math.max(0, 1 - Math.hypot(px - lx, py - ly) / REACH),
  );
  const t = useSpring(near, SPRING);
  const lift = useTransform(t, (value) => -value * RISE);
  const grow = useTransform(t, (value) => 1 + value * 0.12);

  const style = { y: lift, scale: grow, "--t": t } as MotionStyle;

  return (
    <m.span ref={ref} data-layer={layer} style={style} className="cta-letter">
      {char}
    </m.span>
  );
}

/**
 * The call to action: my address set huge. On a mouse the letters swell towards the cursor in
 * the four layer colours and a "Copy email" label follows the pointer; a click, the button
 * below or the C key copies it, and a pulse runs through the four layers ("delivered").
 */
export function BigEmail() {
  const { copied, sent, copy } = useContactCopy();
  const reduceMotion = useReducedMotion();
  const box = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(FAR);
  const y = useMotionValue(FAR);
  const tick = useMotionValue(0);
  const [hovering, setHovering] = useState(false);
  const { email } = site.links;
  const { contact } = site;

  const [local, domain] = email.split("@");
  const chars = [...local, "@", ...domain];
  const perLayer = Math.ceil(chars.length / skillGroups.length);
  const letters = chars.map((char, index) => ({
    char,
    layer: skillGroups[Math.min(Math.floor(index / perLayer), skillGroups.length - 1)].layer,
  }));
  const splitAt = local.length;

  // Fonts and wrapping can change where the letters are: measure again as the pointer arrives
  const enter = () => tick.set(tick.get() + 1);

  const move = (event: PointerEvent<HTMLButtonElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - bounds.left);
    y.set(event.clientY - bounds.top);
    setHovering(true);
  };

  const leave = () => {
    x.set(FAR);
    y.set(FAR);
    setHovering(false);
  };

  const label = (
    <>
      <span className="icon-swap size-5" data-icon={copied ? "b" : "a"}>
        <Copy />
        <Check />
      </span>
      <span className="grid">
        <span className="label-swap" data-active={!copied}>
          {contact.copyLabel}
        </span>
        <span className="label-swap" data-active={copied}>
          {contact.copiedLabel}
        </span>
      </span>
    </>
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="type-small">{contact.emailLabel}</p>
        <kbd className="contact-kbd">{contact.shortcutHint}</kbd>
      </div>

      {/* The whole address is one button. Letters are decorative; the label carries the name. */}
      <button
        ref={box}
        type="button"
        onClick={copy}
        onPointerEnter={enter}
        onPointerMove={move}
        onPointerLeave={leave}
        aria-label={`${contact.copyLabel}: ${email}`}
        className="contact-big"
      >
        <span aria-hidden="true">
          {/* One line: the address is a single element and never wraps */}
          <span>
            {letters.slice(0, splitAt).map((letter, index) => (
              <Letter key={index} {...letter} box={box} x={x} y={y} tick={tick} />
            ))}
          </span>
          <span>
            {letters.slice(splitAt).map((letter, index) => (
              <Letter key={splitAt + index} {...letter} box={box} x={x} y={y} tick={tick} />
            ))}
          </span>
        </span>

        {/* Follows the mouse; touch screens use the button below */}
        <m.span
          aria-hidden="true"
          data-copied={copied}
          initial={false}
          animate={{ opacity: hovering ? 1 : 0, scale: hovering ? 1 : 0.8 }}
          transition={{ duration: 0.15 }}
          style={{ left: x, top: y }}
          className="contact-pill contact-cursor"
        >
          {label}
        </m.span>
      </button>

      {/* Four segments, one per layer: they light up one after another when the email is copied */}
      <div key={sent} data-sent={sent > 0} className="contact-pipe" aria-hidden="true">
        {skillGroups.map((group, index) => (
          <div key={group.layer} data-layer={group.layer} className="contact-pipe-step">
            <span className="layer-fill contact-pipe-bar" data-step={index} />
            <span className="type-small hidden sm:block">{group.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={copy} data-copied={copied} className="contact-pill">
          {label}
        </button>
        <a href={`mailto:${email}`} className="contact-ghost">
          {contact.mailLabel}
        </a>
      </div>
    </div>
  );
}
