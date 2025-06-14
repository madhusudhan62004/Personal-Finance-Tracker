import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function calculatePercentage(current: number, total: number): number {
  if (total === 0) return 0
  return Math.min(Math.round((current / total) * 100), 100)
}

export function getProgressColor(percentage: number): string {
  if (percentage < 30) return "bg-red-500"
  if (percentage < 70) return "bg-yellow-500"
  return "bg-green-500"
}

export function getBudgetProgressColor(spent: number, limit: number): string {
  const percentage = (spent / limit) * 100
  if (percentage > 90) return "bg-red-500"
  if (percentage > 70) return "bg-yellow-500"
  return "bg-green-500"
}
