/**
 * Feature Flags & Subscription Tiers
 * Controls access to marketing suite features based on user plan
 */

// ============================================
// Subscription Tiers
// ============================================

export enum SubscriptionTier {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO',
  ELITE = 'ELITE',
  GROWTH_MASTER = 'GROWTH_MASTER',
}

export interface TierConfig {
  id: SubscriptionTier
  name: string
  price: number
  billingPeriod: 'month'
  features: string[]
  limits: TierLimits
}

export interface TierLimits {
  aiPostsPerMonth: number
  templatesAccess: 'none' | 'basic' | 'all'
  platforms: number
  scheduledPosts: number
  competitorProfiles: number
  adCampaigns: number
  leadStorage: number
  spokespersonVideos: number
  abTests: number
}

// ============================================
// Tier Definitions
// ============================================

export const TIER_CONFIGS: Record<SubscriptionTier, TierConfig> = {
  [SubscriptionTier.FREE]: {
    id: SubscriptionTier.FREE,
    name: 'Free',
    price: 0,
    billingPeriod: 'month',
    features: [
      'Basic post templates',
      'Manual post planner',
      'Image generation (5/month)',
      'Basic SEO scoring',
    ],
    limits: {
      aiPostsPerMonth: 5,
      templatesAccess: 'basic',
      platforms: 2,
      scheduledPosts: 10,
      competitorProfiles: 0,
      adCampaigns: 0,
      leadStorage: 0,
      spokespersonVideos: 0,
      abTests: 0,
    },
  },

  [SubscriptionTier.STARTER]: {
    id: SubscriptionTier.STARTER,
    name: 'Starter',
    price: 39,
    billingPeriod: 'month',
    features: [
      'Industry templates',
      'Smart SEO + hashtags',
      'Google Calendar sync',
      '25 AI posts/month',
      'Post performance estimator',
      'All FREE features',
    ],
    limits: {
      aiPostsPerMonth: 25,
      templatesAccess: 'all',
      platforms: 4,
      scheduledPosts: 50,
      competitorProfiles: 1,
      adCampaigns: 0,
      leadStorage: 50,
      spokespersonVideos: 0,
      abTests: 0,
    },
  },

  [SubscriptionTier.PRO]: {
    id: SubscriptionTier.PRO,
    name: 'Pro',
    price: 99,
    billingPeriod: 'month',
    features: [
      'Cross-platform reformatter',
      'Performance scoring',
      'Auto-post scheduling',
      'AI-optimized timing',
      '100 AI posts/month',
      'Analytics dashboard',
      'All STARTER features',
    ],
    limits: {
      aiPostsPerMonth: 100,
      templatesAccess: 'all',
      platforms: 6,
      scheduledPosts: 200,
      competitorProfiles: 3,
      adCampaigns: 2,
      leadStorage: 200,
      spokespersonVideos: 2,
      abTests: 3,
    },
  },

  [SubscriptionTier.ELITE]: {
    id: SubscriptionTier.ELITE,
    name: 'Elite',
    price: 199,
    billingPeriod: 'month',
    features: [
      'Auto-iterate A/B testing',
      'AI Marketing Brain',
      'Ad campaign manager',
      'Competitor scanner (5 profiles)',
      'Unlimited AI posts',
      'All PRO features',
    ],
    limits: {
      aiPostsPerMonth: -1, // unlimited
      templatesAccess: 'all',
      platforms: 10,
      scheduledPosts: -1,
      competitorProfiles: 5,
      adCampaigns: 10,
      leadStorage: 1000,
      spokespersonVideos: 10,
      abTests: 10,
    },
  },

  [SubscriptionTier.GROWTH_MASTER]: {
    id: SubscriptionTier.GROWTH_MASTER,
    name: 'Growth Master',
    price: 399,
    billingPeriod: 'month',
    features: [
      'Full CRM + lead nurture',
      'AI spokesperson videos (25/month)',
      'ROI attribution tracking',
      'Reputation monitoring',
      'Growth simulator',
      'Priority support',
      'All ELITE features',
    ],
    limits: {
      aiPostsPerMonth: -1,
      templatesAccess: 'all',
      platforms: -1, // unlimited
      scheduledPosts: -1,
      competitorProfiles: 20,
      adCampaigns: -1,
      leadStorage: -1,
      spokespersonVideos: 25,
      abTests: -1,
    },
  },
}

// ============================================
// Feature Flags
// ============================================

export enum Feature {
  // Phase 1 Features
  POST_TEMPLATES = 'POST_TEMPLATES',
  INDUSTRY_TEMPLATES = 'INDUSTRY_TEMPLATES',
  ENHANCED_SEO = 'ENHANCED_SEO',
  SMART_CALENDAR = 'SMART_CALENDAR',
  AI_OPTIMIZED_TIMING = 'AI_OPTIMIZED_TIMING',
  CROSS_PLATFORM_REFORMATTER = 'CROSS_PLATFORM_REFORMATTER',
  PERFORMANCE_ESTIMATOR = 'PERFORMANCE_ESTIMATOR',

  // Phase 2 Features
  AUTO_ITERATE_AB_TEST = 'AUTO_ITERATE_AB_TEST',
  AI_MARKETING_BRAIN = 'AI_MARKETING_BRAIN',
  AD_MANAGER = 'AD_MANAGER',
  COMPETITOR_SCANNER = 'COMPETITOR_SCANNER',

  // Phase 3 Features
  ANALYTICS_DASHBOARD = 'ANALYTICS_DASHBOARD',
  GAMIFICATION = 'GAMIFICATION',
  CRM_LEAD_NURTURE = 'CRM_LEAD_NURTURE',
  REPUTATION_MONITORING = 'REPUTATION_MONITORING',
  AI_SPOKESPERSON = 'AI_SPOKESPERSON',
  ROI_ATTRIBUTION = 'ROI_ATTRIBUTION',
  GROWTH_SIMULATOR = 'GROWTH_SIMULATOR',
}

// Map features to minimum required tier
export const FEATURE_TIER_MAP: Record<Feature, SubscriptionTier> = {
  // Phase 1
  [Feature.POST_TEMPLATES]: SubscriptionTier.FREE,
  [Feature.INDUSTRY_TEMPLATES]: SubscriptionTier.STARTER,
  [Feature.ENHANCED_SEO]: SubscriptionTier.STARTER,
  [Feature.SMART_CALENDAR]: SubscriptionTier.STARTER,
  [Feature.AI_OPTIMIZED_TIMING]: SubscriptionTier.PRO,
  [Feature.CROSS_PLATFORM_REFORMATTER]: SubscriptionTier.PRO,
  [Feature.PERFORMANCE_ESTIMATOR]: SubscriptionTier.STARTER,

  // Phase 2
  [Feature.AUTO_ITERATE_AB_TEST]: SubscriptionTier.ELITE,
  [Feature.AI_MARKETING_BRAIN]: SubscriptionTier.ELITE,
  [Feature.AD_MANAGER]: SubscriptionTier.ELITE,
  [Feature.COMPETITOR_SCANNER]: SubscriptionTier.ELITE,

  // Phase 3
  [Feature.ANALYTICS_DASHBOARD]: SubscriptionTier.PRO,
  [Feature.GAMIFICATION]: SubscriptionTier.PRO,
  [Feature.CRM_LEAD_NURTURE]: SubscriptionTier.GROWTH_MASTER,
  [Feature.REPUTATION_MONITORING]: SubscriptionTier.GROWTH_MASTER,
  [Feature.AI_SPOKESPERSON]: SubscriptionTier.GROWTH_MASTER,
  [Feature.ROI_ATTRIBUTION]: SubscriptionTier.GROWTH_MASTER,
  [Feature.GROWTH_SIMULATOR]: SubscriptionTier.GROWTH_MASTER,
}

// ============================================
// Access Control Functions
// ============================================

/**
 * Check if user has access to a feature
 * UNLOCKED: All features are accessible to all users by default
 */
export function hasFeatureAccess(
  userTier: SubscriptionTier,
  feature: Feature
): boolean {
  // Always return true - all features unlocked for everyone
  // Pricing tiers remain displayed but don't block functionality
  return true
}

/**
 * Check if user is within usage limits
 * UNLOCKED: All users have unlimited usage by default
 */
export function checkLimit(
  userTier: SubscriptionTier,
  limitType: keyof TierLimits,
  currentUsage: number
): { allowed: boolean; limit: number; remaining: number } {
  // Always return unlimited access - all features unlocked for everyone
  // Pricing tiers remain displayed but don't block functionality
  return { allowed: true, limit: -1, remaining: -1 }
}

/**
 * Get tier configuration
 */
export function getTierConfig(tier: SubscriptionTier): TierConfig {
  return TIER_CONFIGS[tier]
}

/**
 * Get all available tiers
 */
export function getAllTiers(): TierConfig[] {
  return Object.values(TIER_CONFIGS)
}

/**
 * Get upgrade suggestion
 */
export function getUpgradeSuggestion(
  userTier: SubscriptionTier,
  feature: Feature
): TierConfig | null {
  const requiredTier = FEATURE_TIER_MAP[feature]
  const tierOrder = [
    SubscriptionTier.FREE,
    SubscriptionTier.STARTER,
    SubscriptionTier.PRO,
    SubscriptionTier.ELITE,
    SubscriptionTier.GROWTH_MASTER,
  ]

  const userTierIndex = tierOrder.indexOf(userTier)
  const requiredTierIndex = tierOrder.indexOf(requiredTier)

  if (requiredTierIndex > userTierIndex) {
    return TIER_CONFIGS[requiredTier]
  }

  return null
}

// ============================================
// Usage Tracking Helpers
// ============================================

/**
 * Format usage display
 */
export function formatUsage(current: number, limit: number): string {
  if (limit === -1) {
    return `${current} / Unlimited`
  }
  return `${current} / ${limit}`
}

/**
 * Calculate usage percentage
 */
export function usagePercentage(current: number, limit: number): number {
  if (limit === -1) return 0
  return Math.min(100, (current / limit) * 100)
}

/**
 * Get usage status color
 */
export function getUsageColor(
  current: number,
  limit: number
): 'green' | 'yellow' | 'red' {
  if (limit === -1) return 'green'

  const percentage = (current / limit) * 100

  if (percentage >= 90) return 'red'
  if (percentage >= 70) return 'yellow'
  return 'green'
}
