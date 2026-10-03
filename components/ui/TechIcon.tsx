import { Cloud, Sparkles, Video, Zap, type LucideIcon } from "lucide-react";
import {
  siCampaignmonitor,
  siExpress,
  siGit,
  siGithubactions,
  siJavascript,
  siLaravel,
  siMake,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPostman,
  siPrisma,
  siReact,
  siRedis,
  siRedux,
  siTailwindcss,
  siTypescript,
  siWhatsapp,
  siZoom,
  type SimpleIcon,
} from "simple-icons";
import { LAYER_ICONS } from "@/components/ui/LayerIcon";
import type { IconKey, Layer } from "@/data/types";
import { cn } from "@/lib/utils";

// Imported by name, so only these logos end up in the build
const SIMPLE_ICONS: Partial<Record<IconKey, SimpleIcon>> = {
  react: siReact,
  nextjs: siNextdotjs,
  typescript: siTypescript,
  tailwind: siTailwindcss,
  redux: siRedux,
  javascript: siJavascript,
  nodejs: siNodedotjs,
  express: siExpress,
  prisma: siPrisma,
  laravel: siLaravel,
  zoom: siZoom,
  whatsapp: siWhatsapp,
  campaignmonitor: siCampaignmonitor,
  postgresql: siPostgresql,
  mongodb: siMongodb,
  mysql: siMysql,
  redis: siRedis,
  githubactions: siGithubactions,
  git: siGit,
  postman: siPostman,
  make: siMake,
};

// Not in simple-icons (checked against v16.33): Azure, OpenAI, Mux, Motion
const LUCIDE_ICONS: Partial<Record<IconKey, LucideIcon>> = {
  azure: Cloud,
  openai: Sparkles,
  mux: Video,
  motion: Zap,
};

type TechIconProps = {
  icon: IconKey;
  /** The layer of the technology; its icon is the fallback when there is no logo */
  layer: Layer;
  className?: string;
};

/**
 * A technology's logo as an inline SVG in `currentColor`, so it takes the badge's layer
 * colour instead of the brand colour. Decorative: the name is always next to it.
 * It renders on the server, so the logos add nothing to the JavaScript sent to the browser.
 */
export function TechIcon({ icon, layer, className }: TechIconProps) {
  const classes = cn("size-4 shrink-0", className);
  const logo = SIMPLE_ICONS[icon];

  if (logo) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        className={classes}
      >
        <path d={logo.path} />
      </svg>
    );
  }

  const Fallback = LUCIDE_ICONS[icon] ?? LAYER_ICONS[layer];
  return <Fallback aria-hidden="true" className={classes} />;
}
