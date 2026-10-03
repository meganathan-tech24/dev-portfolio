import { ImageResponse } from "next/og";
import { archivoExpandedExtraBold } from "@/lib/fonts";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      tw="flex h-full w-full items-center justify-center bg-neutral-900 text-sky-300 text-8xl"
      style={{ fontFamily: "Archivo Expanded", fontWeight: 800 }}
    >
      M
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Archivo Expanded",
          data: archivoExpandedExtraBold,
          style: "normal",
          weight: 800,
        },
      ],
    },
  );
}
