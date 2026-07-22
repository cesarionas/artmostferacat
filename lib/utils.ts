import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export const formatBytes = (bytes: number) => new Intl.NumberFormat("pt-BR", { notation: "compact", style: "unit", unit: "byte" }).format(bytes || 0);
