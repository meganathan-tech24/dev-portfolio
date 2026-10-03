import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { OG_FONTS, OG_SIZE, OgLayerBars } from "@/lib/og";

export const alt = `${site.name}, ${site.role}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div tw="flex h-full w-full flex-col justify-between bg-neutral-900 p-16 text-neutral-100">
      <div tw="flex flex-col">
        <div
          tw="text-8xl leading-none"
          style={{ fontFamily: "Archivo Expanded", fontWeight: 800 }}
        >
          {site.name}
        </div>
        <div
          tw="mt-8 text-4xl text-neutral-400"
          style={{ fontFamily: "Archivo", fontWeight: 600 }}
        >
          {site.role}
        </div>
      </div>
      <OgLayerBars />
    </div>,
    { ...size, fonts: OG_FONTS },
  );
}
