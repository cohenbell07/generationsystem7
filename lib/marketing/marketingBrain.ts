/**
 * AI Marketing Brain
 * Weekly strategic analysis and actionable recommendations
 */

import { callGPTJSON, callBestLLM } from '../ai/llm'
import { db } from '../db'

export interface MarketingBrainAnalysis {
  weeklyInsights: string[]
  contentRecommendations: {
    type: string
    topic: string
    reasoning: string
    priority: 'high' | 'medium' | 'low'
  }[]
  platformPriorities: {
    platform: string
    focus: string
    expectedROI: string
  }[]
  competitiveAdvantages: string[]
  riskAlerts: string[]
  nextWeekStrategy: {
    goals: string[]
    contentPillars: string[]
    postingSchedule: string
  }
}

/**
 * Analyze recent content and generate strategic recommendations
 */
export async function analyzeMarketingStrategy(params: {
  userId: string
  timeframe?: 'week' | 'month'
}): Promise<MarketingBrainAnalysis> {
  const { userId, timeframe = 'week' } = params

  // FALLBACK MODE: If no API keys, return dummy analysis
  if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    console.log('⚠️  AI Marketing Brain - using fallback demo analysis')
    return {
      weeklyInsights: [
        '[DEMO] Your Instagram engagement increased 15% this week',
        '[DEMO] Video content performed 2x better than images',
        '[DEMO] Peak engagement time: Tuesday 7PM',
      ],
      contentRecommendations: [
        {
          type: 'video',
          topic: 'Behind-the-scenes product showcase',
          reasoning: 'Video content shows strong engagement trends',
          priority: 'high',
        },
        {
          type: 'carousel',
          topic: 'Customer success stories',
          reasoning: 'Testimonials drive conversion',
          priority: 'medium',
        },
      ],
      platformPriorities: [
        {
          platform: 'Instagram',
          focus: 'Increase Reels frequency',
          expectedROI: '25% engagement boost',
        },
        {
          platform: 'TikTok',
          focus: 'Experiment with trending sounds',
          expectedROI: '40% reach increase',
        },
      ],
      competitiveAdvantages: [
        '[DEMO] Your response time is faster than 80% of competitors',
        '[DEMO] Your content consistency is a key strength',
      ],
      riskAlerts: [
        '[DEMO] Engagement dropping on Facebook - consider platform pivot',
      ],
      nextWeekStrategy: {
        goals: ['Increase video content by 50%', 'Test 3 new content formats'],
        contentPillars: ['Education', 'Entertainment', 'Inspiration'],
        postingSchedule: '5 posts/week across 3 platforms',
      },
    }
  }

  // Get historical data
  const daysAgo = timeframe === 'week' ? 7 : 30
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - daysAgo)

  const recentPosts = await db.postDraft.findMany({
    where: {
      userId,
      createdAt: { gte: startDate },
    },
    include: {
      metrics: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  })

  // Aggregate metrics
  const platformMetrics: Record<string, any> = {}
  const contentTypeMetrics: Record<string, any> = {}

  recentPosts.forEach((post) => {
    const platform = post.platform || 'unknown'
    const contentType = post.contentType || 'image'

    if (!platformMetrics[platform]) {
      platformMetrics[platform] = { count: 0, totalEngagement: 0 }
    }
    if (!contentTypeMetrics[contentType]) {
      contentTypeMetrics[contentType] = { count: 0, totalEngagement: 0 }
    }

    const avgEngagement =
      post.metrics.length > 0
        ? post.metrics.reduce((sum, m) => sum + m.engagement, 0) /
          post.metrics.length
        : 0

    platformMetrics[platform].count++
    platformMetrics[platform].totalEngagement += avgEngagement

    contentTypeMetrics[contentType].count++
    contentTypeMetrics[contentType].totalEngagement += avgEngagement
  })

  // Generate AI analysis
  const prompt = `You are a senior marketing strategist analyzing social media performance.

Timeframe: ${timeframe} (${daysAgo} days)
Total Posts: ${recentPosts.length}

Platform Performance:
${JSON.stringify(platformMetrics, null, 2)}

Content Type Performance:
${JSON.stringify(contentTypeMetrics, null, 2)}

Provide a comprehensive marketing strategy analysis with:
1. Weekly insights (3-5 key observations)
2. Content recommendations (3-5 specific content ideas with type, topic, reasoning, priority)
3. Platform priorities (for each platform: focus area, expected ROI)
4. Competitive advantages (2-3 strengths)
5. Risk alerts (1-2 potential issues to address)
6. Next week strategy (goals, content pillars, posting schedule)

Return as JSON matching the MarketingBrainAnalysis interface.`

  try {
    return await callGPTJSON<MarketingBrainAnalysis>(
      prompt,
      'You are a marketing strategy expert. Provide actionable, data-driven insights.'
    )
  } catch (error) {
    console.error('[Marketing Brain] Analysis failed:', error)
    // Return basic fallback
    return {
      weeklyInsights: ['Analysis in progress - check back soon'],
      contentRecommendations: [],
      platformPriorities: [],
      competitiveAdvantages: [],
      riskAlerts: [],
      nextWeekStrategy: {
        goals: ['Maintain consistent posting'],
        contentPillars: ['Value', 'Engagement', 'Growth'],
        postingSchedule: 'Regular daily posts',
      },
    }
  }
}

/**
 * Generate weekly marketing report
 */
export async function generateWeeklyReport(userId: string) {
  const analysis = await analyzeMarketingStrategy({ userId, timeframe: 'week' })

  return {
    title: 'Weekly Marketing Intelligence Report',
    generatedAt: new Date().toISOString(),
    summary: analysis.weeklyInsights.join(' • '),
    analysis,
  }
}
