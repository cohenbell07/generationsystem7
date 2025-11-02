/**
 * Marketing Optimization Engine
 * AI-driven optimization for post timing, content selection, and performance
 */

import { callGPTJSON, callClaude, quickPrompt } from '../ai/llm'
import { db } from '../db'

// ============================================
// Types
// ============================================

export interface OptimalPostTime {
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  hour: number // 0-23
  confidence: number // 0-1
  reasoning: string
}

export interface ContentOptimization {
  recommendations: string[]
  predictedEngagement: number
  score: number // 0-10
  improvements: {
    category: string
    suggestion: string
    impact: 'high' | 'medium' | 'low'
  }[]
}

export interface PerformancePrediction {
  estimatedImpressions: { min: number; max: number }
  estimatedEngagement: { min: number; max: number }
  conversionScore: number // 1-10
  suggestions: string[]
  confidence: number // 0-1
}

// ============================================
// AI-Optimized Posting Times
// ============================================

/**
 * Determine optimal posting times using AI + historical data
 */
export async function getOptimalPostTimes(params: {
  userId: string
  platform: string
  contentType: string // "image", "video", "carousel"
  targetAudience?: string
}): Promise<OptimalPostTime[]> {
  const { userId, platform, contentType, targetAudience } = params

  // Get user's historical post performance
  const historicalPosts = await db.postDraft.findMany({
    where: {
      userId,
      platform,
      status: 'published',
      publishedAt: { not: null },
    },
    include: {
      metrics: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 50,
  })

  // Calculate engagement by time
  const timePerformance: Record<string, { count: number; totalEngagement: number }> = {}

  historicalPosts.forEach((post) => {
    if (!post.publishedAt || post.metrics.length === 0) return

    const date = new Date(post.publishedAt)
    const dayOfWeek = date.getDay()
    const hour = date.getHours()
    const key = `${dayOfWeek}-${hour}`

    if (!timePerformance[key]) {
      timePerformance[key] = { count: 0, totalEngagement: 0 }
    }

    const avgEngagement =
      post.metrics.reduce((sum, m) => sum + m.engagement, 0) / post.metrics.length

    timePerformance[key].count++
    timePerformance[key].totalEngagement += avgEngagement
  })

  // Format historical data for AI
  const historicalSummary = Object.entries(timePerformance)
    .map(([key, data]) => {
      const [day, hour] = key.split('-')
      const avgEngagement = data.totalEngagement / data.count
      return { day: parseInt(day), hour: parseInt(hour), avgEngagement, count: data.count }
    })
    .sort((a, b) => b.avgEngagement - a.avgEngagement)
    .slice(0, 10)

  // Get AI recommendations
  const prompt = `You are a social media timing optimization expert. Analyze this data and recommend the best 5 posting times.

Platform: ${platform}
Content Type: ${contentType}
Target Audience: ${targetAudience || 'general'}

Historical Performance (top 10 times):
${JSON.stringify(historicalSummary, null, 2)}

Based on:
1. Historical performance data
2. Platform-specific best practices for ${platform}
3. Content type optimization
4. Target audience behavior

Recommend 5 optimal posting times. Return JSON array:
[{
  "dayOfWeek": 0-6,
  "hour": 0-23,
  "confidence": 0-1,
  "reasoning": "why this time works"
}]`

  try {
    const recommendations = await callGPTJSON<OptimalPostTime[]>(
      prompt,
      'You are a social media optimization expert. Return valid JSON only.'
    )

    return recommendations.slice(0, 5)
  } catch (error) {
    console.error('[Optimizer] Failed to get AI recommendations:', error)
    // Fallback to generic best times
    return getGenericBestTimes(platform)
  }
}

/**
 * Fallback generic best times by platform
 */
function getGenericBestTimes(platform: string): OptimalPostTime[] {
  const bestTimes: Record<string, OptimalPostTime[]> = {
    instagram: [
      { dayOfWeek: 3, hour: 11, confidence: 0.7, reasoning: 'Wednesday mid-morning engagement peak' },
      { dayOfWeek: 5, hour: 10, confidence: 0.7, reasoning: 'Friday morning scroll time' },
      { dayOfWeek: 1, hour: 17, confidence: 0.6, reasoning: 'Monday evening commute' },
    ],
    tiktok: [
      { dayOfWeek: 2, hour: 19, confidence: 0.8, reasoning: 'Tuesday evening peak usage' },
      { dayOfWeek: 4, hour: 21, confidence: 0.8, reasoning: 'Thursday night entertainment time' },
      { dayOfWeek: 6, hour: 14, confidence: 0.7, reasoning: 'Saturday afternoon leisure' },
    ],
    facebook: [
      { dayOfWeek: 3, hour: 13, confidence: 0.7, reasoning: 'Wednesday lunch break' },
      { dayOfWeek: 4, hour: 15, confidence: 0.6, reasoning: 'Thursday afternoon break' },
      { dayOfWeek: 0, hour: 19, confidence: 0.7, reasoning: 'Sunday evening family time' },
    ],
    linkedin: [
      { dayOfWeek: 2, hour: 8, confidence: 0.8, reasoning: 'Tuesday morning professional engagement' },
      { dayOfWeek: 3, hour: 12, confidence: 0.7, reasoning: 'Wednesday lunch networking' },
      { dayOfWeek: 4, hour: 9, confidence: 0.7, reasoning: 'Thursday morning career focus' },
    ],
  }

  return bestTimes[platform] || bestTimes.instagram
}

// ============================================
// Content Optimization
// ============================================

/**
 * Get AI-powered content optimization suggestions
 */
export async function optimizeContent(params: {
  caption: string
  platform: string
  imageUrl?: string
  hasVideo?: boolean
  targetGoal?: string // 'engagement', 'awareness', 'conversions'
}): Promise<ContentOptimization> {
  const { caption, platform, imageUrl, hasVideo, targetGoal = 'engagement' } = params

  const prompt = `Analyze this social media content and provide optimization suggestions:

Platform: ${platform}
Goal: ${targetGoal}
Caption: "${caption}"
Has Image: ${imageUrl ? 'yes' : 'no'}
Has Video: ${hasVideo ? 'yes' : 'no'}

Provide:
1. Specific actionable recommendations
2. Predicted engagement score (0-10)
3. Overall optimization score (0-10)
4. Categorized improvements with impact levels

Return JSON:
{
  "recommendations": ["string array"],
  "predictedEngagement": 0-10,
  "score": 0-10,
  "improvements": [{
    "category": "caption|visual|timing|hashtags",
    "suggestion": "specific action",
    "impact": "high|medium|low"
  }]
}`

  try {
    return await callGPTJSON<ContentOptimization>(
      prompt,
      'You are a social media content optimization expert.'
    )
  } catch (error) {
    console.error('[Optimizer] Content optimization failed:', error)
    return {
      recommendations: ['Add more engaging hooks in the first line', 'Include a clear call-to-action'],
      predictedEngagement: 5,
      score: 6,
      improvements: [],
    }
  }
}

// ============================================
// Performance Prediction
// ============================================

/**
 * Predict post performance before publishing
 */
export async function predictPerformance(params: {
  userId: string
  platform: string
  caption: string
  contentType: string
  hasVideo: boolean
  scheduledTime?: Date
}): Promise<PerformancePrediction> {
  const { userId, platform, caption, contentType, hasVideo, scheduledTime } = params

  // Get historical average performance
  const recentPosts = await db.postDraft.findMany({
    where: {
      userId,
      platform,
      status: 'published',
    },
    include: {
      metrics: {
        orderBy: { recordedAt: 'desc' },
        take: 1,
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 20,
  })

  const avgImpressions =
    recentPosts.reduce((sum, p) => {
      const latest = p.metrics[0]
      return sum + (latest?.impressions || 0)
    }, 0) / (recentPosts.length || 1)

  const avgEngagement =
    recentPosts.reduce((sum, p) => {
      const latest = p.metrics[0]
      return sum + (latest?.engagement || 0)
    }, 0) / (recentPosts.length || 1)

  // AI prediction
  const prompt = `Predict social media post performance based on historical data:

Platform: ${platform}
Content Type: ${contentType}
Has Video: ${hasVideo}
Caption Length: ${caption.length} characters
Caption Preview: "${caption.substring(0, 100)}..."
Scheduled Time: ${scheduledTime?.toISOString() || 'not set'}

Historical Average:
- Impressions: ${avgImpressions.toFixed(0)}
- Engagement Rate: ${avgEngagement.toFixed(2)}%

Predict:
1. Estimated impression range (min/max)
2. Estimated engagement range (min/max)
3. Conversion score (1-10) - likelihood of driving action
4. Suggestions to improve performance
5. Confidence level (0-1)

Return JSON:
{
  "estimatedImpressions": {"min": number, "max": number},
  "estimatedEngagement": {"min": number, "max": number},
  "conversionScore": 1-10,
  "suggestions": ["string array"],
  "confidence": 0-1
}`

  try {
    return await callGPTJSON<PerformancePrediction>(
      prompt,
      'You are a social media analytics expert.'
    )
  } catch (error) {
    console.error('[Optimizer] Performance prediction failed:', error)
    return {
      estimatedImpressions: {
        min: Math.floor(avgImpressions * 0.8),
        max: Math.floor(avgImpressions * 1.2),
      },
      estimatedEngagement: {
        min: avgEngagement * 0.8,
        max: avgEngagement * 1.2,
      },
      conversionScore: 5,
      suggestions: [
        'Post during peak engagement hours',
        'Add a clear call-to-action',
        'Use 3-5 relevant hashtags',
      ],
      confidence: 0.6,
    }
  }
}

// ============================================
// A/B Test Analysis
// ============================================

/**
 * Analyze A/B test results and provide insights
 */
export async function analyzeABTest(params: {
  variantA: { impressions: number; engagement: number }
  variantB: { impressions: number; engagement: number }
  testType: string
  sampleSize: number
}): Promise<{
  winner: 'A' | 'B' | 'tie'
  confidence: number
  insights: string
  recommendation: string
}> {
  const { variantA, variantB, testType, sampleSize } = params

  const prompt = `Analyze this A/B test result:

Test Type: ${testType}
Sample Size: ${sampleSize} impressions per variant

Variant A:
- Impressions: ${variantA.impressions}
- Engagement: ${variantA.engagement}%

Variant B:
- Impressions: ${variantB.impressions}
- Engagement: ${variantB.engagement}%

Determine:
1. Which variant won (A, B, or tie)
2. Statistical confidence (0-1)
3. Key insights from the test
4. Actionable recommendation

Return JSON:
{
  "winner": "A" | "B" | "tie",
  "confidence": 0-1,
  "insights": "detailed analysis",
  "recommendation": "what to do next"
}`

  try {
    return await callGPTJSON(prompt, 'You are a data scientist specializing in A/B testing.')
  } catch (error) {
    console.error('[Optimizer] A/B test analysis failed:', error)

    // Simple comparison fallback
    const aScore = variantA.engagement
    const bScore = variantB.engagement
    const diff = Math.abs(aScore - bScore)

    return {
      winner: aScore > bScore ? 'A' : aScore < bScore ? 'B' : 'tie',
      confidence: Math.min(0.9, diff / 10),
      insights: `Variant ${aScore > bScore ? 'A' : 'B'} showed ${diff.toFixed(2)}% higher engagement.`,
      recommendation: 'Continue using the winning variant.',
    }
  }
}
