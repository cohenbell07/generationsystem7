/**
 * Plan and feature management
 */

export type PlanType = 'FREE' | 'STARTER' | 'IMAGE' | 'SEO' | 'BUNDLE' | 'PRO'

export interface Plan {
  id: PlanType
  name: string
  price: number
  features: string[]
  limits: {
    imageGenerations?: number
    seoGenerations?: number
    scheduledPosts?: number
    videoGenerations?: number // Video is expensive, manually processed
  }
}

export const PLANS: Record<PlanType, Plan> = {
  FREE: {
    id: 'FREE',
    name: 'Free',
    price: 0,
    features: ['Basic features', 'Limited generations'],
    limits: {
      imageGenerations: 5,
      seoGenerations: 5,
      scheduledPosts: 3,
      videoGenerations: 0,
    },
  },
  STARTER: {
    id: 'STARTER',
    name: 'Starter',
    price: 39,
    features: [
      '3 videos per month',
      '50 image generations',
      '50 SEO generations',
      'Basic templates',
      'Platform presets',
      'Manual video processing',
    ],
    limits: {
      imageGenerations: 50,
      seoGenerations: 50,
      scheduledPosts: 10,
      videoGenerations: 3, // Videos are manually processed
    },
  },
  IMAGE: {
    id: 'IMAGE',
    name: 'Image Studio',
    price: 29,
    features: [
      'Unlimited image generation',
      'DALL·E & Gemini models',
      'Product compositing',
      'One-click resize',
      'All platform presets',
    ],
    limits: {
      imageGenerations: -1, // Unlimited
      videoGenerations: 0,
    },
  },
  SEO: {
    id: 'SEO',
    name: 'SEO Studio',
    price: 29,
    features: [
      'Unlimited SEO generation',
      'All platforms supported',
      'SEO scoring & improvements',
      'Platform-aware content',
      'Keyword analysis',
      'Hashtag suggestions',
      'Meta descriptions',
    ],
    limits: {
      seoGenerations: -1,
      videoGenerations: 0,
    },
  },
  BUNDLE: {
    id: 'BUNDLE',
    name: 'Complete Bundle',
    price: 79,
    features: [
      'Image Studio (full)',
      'SEO Studio (full)',
      '5 videos per month',
      'Post Scheduler',
      'Calendar view',
      'Multi-platform posting',
      'Auto-resize to all platforms',
    ],
    limits: {
      imageGenerations: -1,
      seoGenerations: -1,
      scheduledPosts: -1,
      videoGenerations: 5, // Videos are manually processed
    },
  },
  PRO: {
    id: 'PRO',
    name: 'Pro',
    price: 129,
    features: [
      'Everything in Bundle',
      '10 videos per month',
      'Performance analytics',
      'Best-time suggestions',
      'Autoposting',
      'Advanced metrics',
      'Engagement tracking',
      'Smart auto-posting',
    ],
    limits: {
      imageGenerations: -1,
      seoGenerations: -1,
      scheduledPosts: -1,
      videoGenerations: 10, // Videos are manually processed
    },
  },
}

/**
 * Check if user has access to a feature
 * UNLOCKED: All features are accessible to all users by default
 */
export function hasFeatureAccess(userPlan: PlanType, feature: string): boolean {
  // Always return true - all features unlocked for everyone
  // Pricing tiers remain displayed but don't block functionality
  return true
}

/**
 * Check if user is within limits
 * UNLOCKED: All users have unlimited usage by default
 */
export function isWithinLimits(
  userPlan: PlanType,
  usage: { images?: number; seo?: number; posts?: number; videos?: number }
): { images: boolean; seo: boolean; posts: boolean; videos: boolean } {
  // Always return unlimited access - all features unlocked for everyone
  // Pricing tiers remain displayed but don't block functionality
  return {
    images: true,
    seo: true,
    posts: true,
    videos: true,
  }
}
