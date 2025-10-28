/**
 * Platform-specific SEO profiles
 *
 * Each platform has unique requirements for optimal content:
 * - Character limits
 * - Tag/hashtag formatting
 * - Tone preferences
 * - Ranking factors
 */

export interface PlatformProfile {
  id: string
  name: string
  titleMaxLength: number
  descriptionMaxLength: number
  tagFormat: 'hashtag' | 'keyword'
  maxTags: number
  captionMaxLength: number
  preferredTone: string[]
  rankingFactors: string[]
  examples: {
    title: string
    tags: string[]
  }
}

export const PLATFORM_PROFILES: Record<string, PlatformProfile> = {
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    titleMaxLength: 100,
    descriptionMaxLength: 5000,
    tagFormat: 'keyword',
    maxTags: 15,
    captionMaxLength: 5000,
    preferredTone: ['educational', 'engaging', 'conversational'],
    rankingFactors: [
      'Keyword in first 60 characters',
      'Clear value proposition',
      'Numbers and specifics',
      'Power words',
      'Searchable tags',
      'Detailed description with timestamps',
    ],
    examples: {
      title: '5 Simple Steps to Master Python in 2024 | Complete Beginner Guide',
      tags: ['python tutorial', 'programming', 'beginner guide', 'coding'],
    },
  },

  instagram: {
    id: 'instagram',
    name: 'Instagram',
    titleMaxLength: 0, // No title field
    descriptionMaxLength: 0,
    tagFormat: 'hashtag',
    maxTags: 30,
    captionMaxLength: 2200,
    preferredTone: ['casual', 'engaging', 'authentic', 'visual'],
    rankingFactors: [
      'Relevant hashtags (mix of popular and niche)',
      'Engaging first line (before "...more")',
      'Call to action',
      'Emoji usage',
      'Community engagement',
    ],
    examples: {
      title: '',
      tags: [
        '#Photography',
        '#InstaGood',
        '#PhotoOfTheDay',
        '#NaturePhotography',
        '#TravelGram',
      ],
    },
  },

  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    titleMaxLength: 0,
    descriptionMaxLength: 0,
    tagFormat: 'hashtag',
    maxTags: 10,
    captionMaxLength: 150,
    preferredTone: ['trendy', 'fun', 'short', 'punchy'],
    rankingFactors: [
      'Trending hashtags',
      'Short, punchy caption',
      'Hook in first 3 seconds',
      'Relevant sounds',
      'Completion rate',
    ],
    examples: {
      title: '',
      tags: ['#FYP', '#Viral', '#Trending', '#Tutorial', '#LearnOnTikTok'],
    },
  },

  facebook: {
    id: 'facebook',
    name: 'Facebook',
    titleMaxLength: 0,
    descriptionMaxLength: 0,
    tagFormat: 'hashtag',
    maxTags: 5,
    captionMaxLength: 63206,
    preferredTone: ['conversational', 'community', 'informative'],
    rankingFactors: [
      'Engagement (comments, shares)',
      'Meaningful interactions',
      'Video content performance',
      'Post timing',
      'Relevant to audience',
    ],
    examples: {
      title: '',
      tags: ['#SmallBusiness', '#Community', '#LocalLove'],
    },
  },

  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    titleMaxLength: 0,
    descriptionMaxLength: 0,
    tagFormat: 'hashtag',
    maxTags: 5,
    captionMaxLength: 3000,
    preferredTone: ['professional', 'authoritative', 'educational', 'thought leadership'],
    rankingFactors: [
      'Professional insights',
      'Industry-relevant hashtags',
      'Engagement from network',
      'Long-form content',
      'Career/business value',
    ],
    examples: {
      title: '',
      tags: ['#Leadership', '#TechInnovation', '#CareerGrowth', '#B2B'],
    },
  },

  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    titleMaxLength: 100,
    descriptionMaxLength: 500,
    tagFormat: 'keyword',
    maxTags: 20,
    captionMaxLength: 500,
    preferredTone: ['descriptive', 'inspirational', 'actionable'],
    rankingFactors: [
      'Keyword-rich title',
      'Detailed description',
      'Vertical image format',
      'Rich pins',
      'Save rate',
    ],
    examples: {
      title: '10 Easy DIY Home Decor Ideas for Small Spaces',
      tags: ['home decor', 'DIY projects', 'small space living', 'interior design'],
    },
  },

  website: {
    id: 'website',
    name: 'Website/Blog',
    titleMaxLength: 60,
    descriptionMaxLength: 160,
    tagFormat: 'keyword',
    maxTags: 10,
    captionMaxLength: 0,
    preferredTone: ['professional', 'informative', 'SEO-optimized'],
    rankingFactors: [
      'Primary keyword in title',
      'Meta description with CTA',
      'Header structure (H1-H6)',
      'Internal/external links',
      'Mobile optimization',
      'Page speed',
    ],
    examples: {
      title: 'Complete Guide to Digital Marketing in 2024',
      tags: ['digital marketing', 'SEO', 'content strategy', 'online advertising'],
    },
  },

  twitter: {
    id: 'twitter',
    name: 'X (Twitter)',
    titleMaxLength: 0,
    descriptionMaxLength: 0,
    tagFormat: 'hashtag',
    maxTags: 3,
    captionMaxLength: 280,
    preferredTone: ['concise', 'timely', 'conversational'],
    rankingFactors: [
      'Concise message',
      'Relevant hashtags (1-2)',
      'Engagement rate',
      'Timeliness',
      'Thread structure',
    ],
    examples: {
      title: '',
      tags: ['#Tech', '#AI', '#Innovation'],
    },
  },
}

/**
 * Get platform profile by ID
 */
export function getPlatformProfile(platformId: string): PlatformProfile | null {
  return PLATFORM_PROFILES[platformId.toLowerCase()] || null
}

/**
 * Get all available platforms
 */
export function getAllPlatforms(): PlatformProfile[] {
  return Object.values(PLATFORM_PROFILES)
}

/**
 * Format tags according to platform requirements
 */
export function formatTags(tags: string[], platform: string): string[] {
  const profile = getPlatformProfile(platform)
  if (!profile) return tags

  if (profile.tagFormat === 'hashtag') {
    return tags.map((tag) => (tag.startsWith('#') ? tag : `#${tag}`))
  }

  // Keyword format - remove hashtags
  return tags.map((tag) => tag.replace(/^#/, ''))
}
