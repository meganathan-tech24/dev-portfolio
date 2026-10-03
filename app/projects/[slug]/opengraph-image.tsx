import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { OG_FONTS, OG_SIZE, OgLayerBars } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return new ImageResponse(
    <div tw="flex h-full w-full flex-col justify-between bg-neutral-900 p-16 text-neutral-100">
      <div tw="flex flex-col">
        <div tw="text-3xl text-neutral-400" style={{ fontFamily: "Archivo", fontWeight: 600 }}>
          {site.name}
        </div>
        <div
          tw="mt-8 text-8xl leading-none"
          style={{ fontFamily: "Archivo Expanded", fontWeight: 800 }}
        >
          {project.title}
        </div>
        {project ? (
          <div
            tw="mt-8 text-4xl text-neutral-400"
            style={{ fontFamily: "Archivo", fontWeight: 600 }}
          >
            {project.company}
          </div>
        ) : null}
      </div>
      <OgLayerBars />
    </div>,
    { ...size, fonts: OG_FONTS },
  );
}
