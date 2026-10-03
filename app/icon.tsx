import { ImageResponse } from "next/og";
import { archivoExpandedExtraBold } from "@/lib/fonts";
import { LayerMarkImage } from "@/lib/layer-mark-image";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<LayerMarkImage size={32} rounded={true} />, {
    ...size,
    fonts: [
      {
        name: "Archivo Expanded",
        data: archivoExpandedExtraBold,
        style: "normal",
        weight: 800,
      },
    ],
  });
}
