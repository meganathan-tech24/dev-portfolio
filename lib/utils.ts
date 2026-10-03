import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Placeholder values in /data start with "TODO" and must never be shown or linked */
export function isTodo(value: string) {
  return value.startsWith("TODO");
}

/** The last part of a profile URL, e.g. "meganathan-tech-2k" from a LinkedIn address */
export function profileHandle(url: string) {
  return url.replace(/\/+$/, "").split("/").pop() ?? url;
}
