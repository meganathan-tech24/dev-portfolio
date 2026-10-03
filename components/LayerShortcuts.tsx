"use client";

import Link from "next/link";
import { useLayerHighlight } from "@/components/LayerHighlightProvider";
import { skillGroups } from "@/data/skills";

/**
 * The footer's "Stack" column: the four layers, each with its colour marker. Choosing one
 * highlights that layer's tags across the page (the same selection as the diagram and the
 * legends) and goes to the Stack section.
 */
export function LayerShortcuts() {
  const { select } = useLayerHighlight();

  return (
    <ul className="grid gap-2">
      {skillGroups.map((group) => (
        <li key={group.layer} data-layer={group.layer}>
          <Link
            href="/#stack"
            className="link inline-flex items-center gap-2"
            onClick={() => select(group.layer)}
          >
            <span aria-hidden="true" className="layer-fill block size-2.5 rounded-sm" />
            {group.label}
            <span className="sr-only">
              {" "}
              layer: highlights its tags and goes to the Stack section
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
