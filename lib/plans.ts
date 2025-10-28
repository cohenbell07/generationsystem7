/**
 * Plan and feature management
 */

export type PlanType = 'FREE' | 'IMAGE' | 'SEO' | 'BUNDLE' | 'PRO'

export interface Plan {
  id: PlanType
  name: string
  price: number
  features: string[]
  limits: {
    imageGenerations?: number
    seoGenerations?: number
    scheduledPosts?: number
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
    ],
    limits: {
      seoGenerations: -1,
    },
  },
  BUNDLE: {
    id: 'BUNDLE',
    name: 'Complete Bundle',
    price: 49,
    features: [
      'Image Studio (full)',
      'SEO Studio (full)',
      'Post Scheduler',
      'Calendar view',
      'Multi-platform posting',
      'Save $9/month',
    ],
    limits: {
      imageGenerations: -1,
      seoGenerations: -1,
      scheduledPosts: -1,
    },
  },
  PRO: {
    id: 'PRO',
    name: 'Pro Add-On',
    price: 29,
    features: [
      'Performance analytics',
      'Best-time suggestions',
      'Autoposting',
      'Advanced metrics',
      'Engagement tracking',
    ],
    limits: {},
  },
}

/**
 * Check if user has access to a feature
 */
export function hasFeatureAccess(userPlan: PlanType, feature: string): boolean {
  switch (feature) {
    case 'image-generation':
      return ['IMAGE', 'BUNDLE', 'PRO'].includes(userPlan)

    case 'seo-generation':
      return ['SEO', 'BUNDLE', 'PRO'].includes(userPlan)

    case 'scheduler':
      return ['BUNDLE', 'PRO'].includes(userPlan)

    case 'analytics':
      return userPlan === 'PRO'

    case 'autoposting':
      return userPlan === 'PRO'

    case 'best-times':
      return userPlan === 'PRO'

    default:
      return false
  }
}

/**
 * Check if user is within limits
 */
export function isWithinLimits(
  userPlan: PlanType,
  usage: { images?: number; seo?: number; posts?: number }
): { images: boolean; seo: boolean; posts: boolean } {
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
  }
}
