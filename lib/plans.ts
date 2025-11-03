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
 */
export function hasFeatureAccess(userPlan: PlanType, feature: string): boolean {
  switch (feature) {
    case 'image-generation':
      return ['STARTER', 'IMAGE', 'BUNDLE', 'PRO'].includes(userPlan)

    case 'seo-generation':
      return ['STARTER', 'SEO', 'BUNDLE', 'PRO'].includes(userPlan)

    case 'scheduler':
      return ['STARTER', 'BUNDLE', 'PRO'].includes(userPlan)

    case 'video-generation':
      return ['STARTER', 'BUNDLE', 'PRO'].includes(userPlan)

    case 'analytics':
      return userPlan === 'PRO'

    case 'autoposting':
      return userPlan === 'PRO'

    case 'best-times':
      return userPlan === 'PRO'

    case 'auto-resize':
      return ['BUNDLE', 'PRO'].includes(userPlan)

    default:
      return false
  }
}

/**
 * Check if user is within limits
 */
export function isWithinLimits(
  userPlan: PlanType,
  usage: { images?: number; seo?: number; posts?: number; videos?: number }
): { images: boolean; seo: boolean; posts: boolean; videos: boolean } {
  const plan = PLANS[userPlan]

  return {
    images:
      !plan.limits.imageGenerations ||
      plan.limits.imageGenerations === -1 ||
      (usage.images || 0) < plan.limits.imageGenerations,
    seo:
      !plan.limits.seoGenerations ||
      plan.limits.seoGenerations === -1 ||
      (usage.seo || 0) < plan.limits.seoGenerations,
    posts:
      !plan.limits.scheduledPosts ||
      plan.limits.scheduledPosts === -1 ||
      (usage.posts || 0) < plan.limits.scheduledPosts,
    videos:
      !plan.limits.videoGenerations ||
      plan.limits.videoGenerations === -1 ||
      (usage.videos || 0) < plan.limits.videoGenerations,
  }
}
