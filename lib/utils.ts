import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Check if user is a superuser based on adminpw query param
 */
export function isSuperuser(searchParams: URLSearchParams): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'YOURPASSWORD'
  const providedPassword = searchParams.get('adminpw')
  return providedPassword === adminPassword
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Generate unique filename
 */
export function generateFilename(originalName: string, prefix?: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const ext = originalName.split('.').pop()
  const base = prefix || 'file'

  return `${base}_${timestamp}_${random}.${ext}`
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

/**
 * Platform size presets
 */
export const PLATFORM_PRESETS = {
  instagram: { width: 1080, height: 1080, name: 'Instagram Square' },
  'instagram-story': { width: 1080, height: 1920, name: 'Instagram Story' },
  pinterest: { width: 1000, height: 1500, name: 'Pinterest Pin' },
  facebook: { width: 1200, height: 630, name: 'Facebook Post' },
  tiktok: { width: 1080, height: 1920, name: 'TikTok Video' },
  linkedin: { width: 1200, height: 627, name: 'LinkedIn Post' },
  blog: { width: 1600, height: 900, name: 'Blog Header' },
  twitter: { width: 1200, height: 675, name: 'Twitter Post' },
}

export type PlatformPreset = keyof typeof PLATFORM_PRESETS
