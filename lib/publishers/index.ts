import type { Publisher } from './types'
import { facebookPublisher } from './facebook'
import { instagramPublisher } from './instagram'
import { tiktokPublisher } from './tiktok'
import { linkedinPublisher } from './linkedin'
import { pinterestPublisher } from './pinterest'
import { youtubePublisher } from './youtube'

/**
 * Publisher registry
 *
 * Maps platform names to their publisher adapters
 */

const publishers: Record<string, Publisher> = {
  facebook: facebookPublisher,
  instagram: instagramPublisher,
  tiktok: tiktokPublisher,
  linkedin: linkedinPublisher,
  pinterest: pinterestPublisher,
  youtube: youtubePublisher,
}

/**
 * Get publisher for a platform
 */
export function getPublisher(platform: string): Publisher | null {
  return publishers[platform.toLowerCase()] || null
}

/**
 * Get all supported platforms
 */
export function getSupportedPlatforms(): string[] {
  return Object.keys(publishers)
}

export type { Publisher, PostDraft, PublishResult } from './types'
