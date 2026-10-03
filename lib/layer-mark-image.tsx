import { INITIALS } from "@/components/ui/LayerMark";

const BARS = ["bg-sky-300", "bg-emerald-300", "bg-amber-300", "bg-fuchsia-300"];

/**
 * The LayerMark (initials beside four stacked layer-colour bars) drawn for generated images,
 * where ImageResponse cannot use the site's CSS. `size` is the image's width and height in px;
 * `rounded` rounds the corners (the favicon), `false` keeps a full square (the apple-touch-icon).
 */
export function LayerMarkImage({ size, rounded }: { size: number; rounded: boolean }) {
  const unit = size / 32;

  return (
    <div
      tw="flex h-full w-full items-center justify-center bg-neutral-900"
      style={{ gap: 2 * unit, borderRadius: rounded ? 7 * unit : 0 }}
    >
      <div
        tw="text-neutral-50"
        style={{ fontFamily: "Archivo Expanded", fontWeight: 800, fontSize: 10.5 * unit }}
      >
        {INITIALS}
      </div>
      <div tw="flex flex-col" style={{ gap: 2 * unit }}>
        {BARS.map((bar) => (
          <div key={bar} tw={bar} style={{ width: 4.5 * unit, height: 2 * unit }} />
        ))}
      </div>
    </div>
  );
}
