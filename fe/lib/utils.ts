// /home/clod/Desktop/blacklist-linkedin-scammers/fe/src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}