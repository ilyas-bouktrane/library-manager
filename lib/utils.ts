import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const safeNumberParse = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return value !== null && !isNaN(parsed) ? parsed : fallback;
};

export const safeStringParse = (value: unknown, fallback: string): string => {
  return typeof value === "string" && value.trim().length > 0
    ? value
    : fallback;
};
