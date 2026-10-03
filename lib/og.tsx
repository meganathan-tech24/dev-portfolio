import { skillGroups } from "@/data/skills";
import { archivoExpandedExtraBold, archivoSemiBold } from "@/lib/fonts";

// Shared pieces for the generated Open Graph images. ImageResponse (Satori)
// cannot use the site's CSS, so it uses its own `tw` prop with the same
// default Tailwind palette.

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_FONTS = [
  {
    name: "Archivo Expanded",
    data: archivoExpandedExtraBold,
    style: "normal" as const,
    weight: 800 as const,
  },
  {
    name: "Archivo",
    data: archivoSemiBold,
    style: "normal" as const,
    weight: 600 as const,
  },
];

const LAYER_TEXT = {
  interface: "text-sky-300",
  application: "text-emerald-300",
  data: "text-amber-300",
  infrastructure: "text-fuchsia-300",
} as const;

const LAYER_BAR = {
  interface: "bg-sky-300",
  application: "bg-emerald-300",
  data: "bg-amber-300",
  infrastructure: "bg-fuchsia-300",
} as const;

/** The four stack layers as a row of coloured bars with their names */
export function OgLayerBars() {
  return (
    <div tw="flex">
      {skillGroups.map((group, index) => (
        <div
          key={group.layer}
          tw={`flex flex-1 flex-col ${index < skillGroups.length - 1 ? "mr-6" : ""}`}
        >
          <div tw={`h-2 w-full ${LAYER_BAR[group.layer]}`} />
          <div
            tw={`mt-3 text-2xl ${LAYER_TEXT[group.layer]}`}
            style={{ fontFamily: "Archivo", fontWeight: 600 }}
          >
            {group.label}
          </div>
        </div>
      ))}
    </div>
  );
}
