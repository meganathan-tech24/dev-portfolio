import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Placeholder values in /data start with "TODO" and must never be shown or linked */
export function isTodo(value: string) {
  return value.startsWith("TODO");
}
