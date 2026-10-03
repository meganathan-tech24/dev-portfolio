import { otherTech, skillGroups } from "@/data/skills";
import type { IconKey, Skill } from "@/data/types";

const everySkill: Skill[] = [
  ...skillGroups.flatMap((group): Skill[] => group.skills),
  ...otherTech,
];

const ICON_BY_NAME = new Map<string, IconKey>(everySkill.map((skill) => [skill.name, skill.icon]));

/** The icon key for a technology name used anywhere on the site; "layer" if it has no logo */
export function iconKeyFor(name: string): IconKey {
  return ICON_BY_NAME.get(name) ?? "layer";
}
