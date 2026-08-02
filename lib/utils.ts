import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return `£${price}`
}

export function getVideoUpgradeDeadline(purchasedAt: string): Date {
  const date = new Date(purchasedAt)
  date.setMonth(date.getMonth() + 3)
  return date
}

export function isWithinUpgradeWindow(purchasedAt: string): boolean {
  const deadline = getVideoUpgradeDeadline(purchasedAt)
  return new Date() < deadline
}

export function daysUntilDeadline(purchasedAt: string): number {
  const deadline = getVideoUpgradeDeadline(purchasedAt)
  const now = new Date()
  const diff = deadline.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
