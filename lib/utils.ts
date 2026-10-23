import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatNumber = (value: number, maxDecimals = 0) =>
  value.toLocaleString("pt-BR", { maximumFractionDigits: maxDecimals })
