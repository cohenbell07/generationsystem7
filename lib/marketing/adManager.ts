/**
 * AI Ad Manager
 * Convert organic content to paid ads, manage campaigns
 */

import { callGPTJSON } from '../ai/llm'

export interface AdCampaign {
  id: string
  userId: string
  name: string
  platform: 'meta' | 'google' | 'tiktok' | 'linkedin'
  objective: 'awareness' | 'traffic' | 'conversions' | 'engagement'
  status: 'draft' | 'active' | 'paused' | 'completed'
  budget: {
    daily: number
    total: number
    spent: number
  }
  targeting: {
    locations: string[]
    ageRange: { min: number; max: number }
    interests: string[]
    behaviors: string[]
  }
  creatives: AdCreative[]
  performance?: AdPerformance
}

export interface AdCreative {
  id: string
  headline: string
  description: string
  callToAction: string
  imageUrl: string
  targetUrl: string
}

export interface AdPerformance {
  impressions: number
  clicks: number
  conversions: number
  cost: number
  ctr: number // Click-through rate
  cpc: number // Cost per click
  roi: number // Return on investment
}

/**
 * Convert organic post to ad creative
 */
export async function convertToAdCreative(params: {
  organicCaption: string
  imageUrl: string
  platform: 'meta' | 'google' | 'tiktok' | 'linkedin'
  objective: string
}): Promise<AdCreative> {
  const { organicCaption, imageUrl, platform, objective } = params

  // FALLBACK MODE
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  Ad Manager - using fallback ad creative')
    return {
      id: `creative-${Date.now()}`,
      headline: '[DEMO] Compelling Ad Headline',
      description: `${organicCaption.substring(0, 100)} [Optimized for ${platform} ads]`,
      callToAction: 'Learn More',
      imageUrl,
      targetUrl: 'https://example.com',
    }
  }

  const prompt = `Convert this organic content to a ${platform} ad creative:

Organic Caption: "${organicCaption}"
Platform: ${platform}
Campaign Objective: ${objective}

Create ad-optimized version with:
- headline: string (short, compelling, max 40 chars)
- description: string (engaging, benefit-focused, max 125 chars)
- callToAction: string (action-oriented button text)
- targetUrl: string (placeholder URL)

Platform-specific best practices:
- Meta: Emotional appeal, visual focus
- Google: Search intent, keyword optimization
- TikTok: Authentic, entertaining, native feel
- LinkedIn: Professional, B2B focused

Return JSON matching AdCreative interface (without id).`

  try {
    const creative = await callGPTJSON<Omit<AdCreative, 'id'>>(
      prompt,
      'You are a paid advertising expert specializing in ad creative optimization.'
    )

    return {
      ...creative,
      id: `creative-${Date.now()}`,
      imageUrl,
    }
  } catch (error) {
    console.error('[Ad Manager] Creative conversion failed:', error)
    return {
      id: `creative-${Date.now()}`,
      headline: 'Discover More',
      description: organicCaption.substring(0, 125),
      callToAction: 'Learn More',
      imageUrl,
      targetUrl: 'https://example.com',
    }
  }
}

/**
 * Generate ad campaign strategy
 */
export async function generateCampaignStrategy(params: {
  businessType: string
  goal: string
  budget: number
  platform: string
}): Promise<{
  campaignName: string
  targetingRecommendations: any
  budgetAllocation: any
  expectedResults: any
  optimizationTips: string[]
}> {
  const { businessType, goal, budget, platform } = params

  // FALLBACK MODE
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  Campaign strategy - using fallback')
    return {
      campaignName: `[DEMO] ${businessType} - ${goal} Campaign`,
      targetingRecommendations: {
        ageRange: '25-54',
        interests: ['business', 'marketing', 'entrepreneurship'],
        locations: ['United States', 'Canada', 'United Kingdom'],
      },
      budgetAllocation: {
        testing: '20%',
        scaling: '80%',
        dailyBudget: (budget / 30).toFixed(2),
      },
      expectedResults: {
        estimatedReach: '50K-100K',
        estimatedClicks: '1K-2K',
        estimatedCPC: '$0.50-$1.50',
      },
      optimizationTips: [
        '[DEMO] Test 3-5 ad variations',
        '[DEMO] Monitor CTR daily',
        '[DEMO] A/B test audiences',
      ],
    }
  }

  const prompt = `Create ad campaign strategy for ${businessType}:

Goal: ${goal}
Budget: $${budget}
Platform: ${platform}

Provide comprehensive strategy with:
- campaignName: string
- targetingRecommendations: { ageRange, interests, locations, behaviors }
- budgetAllocation: { testing, scaling, dailyBudget }
- expectedResults: { estimatedReach, estimatedClicks, estimatedCPC }
- optimizationTips: string[] (5 specific tips)

Return as JSON.`

  try {
    return await callGPTJSON(prompt, 'You are a paid advertising strategist.')
  } catch (error) {
    console.error('[Ad Manager] Strategy generation failed:', error)
    return {
      campaignName: `${businessType} Campaign`,
      targetingRecommendations: {},
      budgetAllocation: {},
      expectedResults: {},
      optimizationTips: [],
    }
  }
}

/**
 * Analyze ad performance and provide recommendations
 */
export async function analyzeAdPerformance(
  campaign: AdCampaign
): Promise<{
  performanceScore: number
  insights: string[]
  recommendations: string[]
  shouldScale: boolean
  shouldPause: boolean
}> {
  // FALLBACK MODE
  if (!process.env.OPENAI_API_KEY) {
    return {
      performanceScore: 7.5,
      insights: [
        '[DEMO] CTR is above industry average',
        '[DEMO] Conversion rate improving',
      ],
      recommendations: [
        '[DEMO] Increase budget by 20%',
        '[DEMO] Test new ad creative',
      ],
      shouldScale: true,
      shouldPause: false,
    }
  }

  const prompt = `Analyze this ad campaign performance:

Campaign: ${campaign.name}
Platform: ${campaign.platform}
Budget: $${campaign.budget.daily}/day
Spent: $${campaign.budget.spent}

Performance:
${JSON.stringify(campaign.performance, null, 2)}

Provide analysis:
- performanceScore: 0-10
- insights: key observations (3-5 points)
- recommendations: specific actions (3-5 points)
- shouldScale: boolean (if performing well)
- shouldPause: boolean (if underperforming)

Return as JSON.`

  try {
    return await callGPTJSON(
      prompt,
      'You are a performance marketing analyst.'
    )
  } catch (error) {
    return {
      performanceScore: 5,
      insights: ['Performance data available'],
      recommendations: ['Monitor campaign closely'],
      shouldScale: false,
      shouldPause: false,
    }
  }
}
