import { ImageResponse } from "next/og";
import { archivoExpandedExtraBold } from "@/lib/fonts";
import { LayerMarkImage } from "@/lib/layer-mark-image";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<LayerMarkImage size={180} rounded={false} />, {
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
