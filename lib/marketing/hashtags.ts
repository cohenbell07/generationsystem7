/**
 * AI Hashtag & Trend Tracker
 * Show trending topics per niche, suggest optimal hashtags
 */

import { callGPTJSON } from '../ai/llm'

export interface TrendingTopic {
  topic: string
  platform: string
  trendScore: number // 0-100
  volume: string // e.g., "125K posts"
  growthRate: string // e.g., "+45% this week"
  recommendedHashtags: string[]
  contentIdeas: string[]
}

export interface HashtagAnalysis {
  hashtag: string
  volume: string
  competition: 'low' | 'medium' | 'high'
  relevanceScore: number // 0-10
  recommendation: 'use' | 'consider' | 'avoid'
  alternatives: string[]
}

/**
 * Get trending topics for a niche
 */
export async function getTrendingTopics(params: {
  niche: string
  platform: string
  count?: number
}): Promise<TrendingTopic[]> {
  const { niche, platform, count = 10 } = params

  // FALLBACK MODE - Return demo trends
  if (!process.env.OPENAI_API_KEY && !process.env.SERPAPI_KEY) {
    console.log('⚠️  Hashtag Tracker - using fallback trending topics')
    return [
      {
        topic: `[DEMO] ${niche} Best Practices`,
        platform,
        trendScore: 85,
        volume: '125K posts',
        growthRate: '+45% this week',
        recommendedHashtags: ['#trending', '#viral', `#${niche.toLowerCase()}`],
        contentIdeas: [
          'Create a tips carousel',
          'Share success story',
          'Behind-the-scenes video',
        ],
      },
      {
        topic: `[DEMO] ${niche} Trends 2024`,
        platform,
        trendScore: 72,
        volume: '89K posts',
        growthRate: '+32% this week',
        recommendedHashtags: ['#2024trends', `#${niche.toLowerCase()}tips`, '#marketing'],
        contentIdeas: [
          'Prediction post',
          'Year in review',
          'Future forecast video',
        ],
      },
      {
        topic: `[DEMO] ${niche} Success Stories`,
        platform,
        trendScore: 68,
        volume: '56K posts',
        growthRate: '+28% this week',
        recommendedHashtags: ['#success', '#inspiration', `#${niche.toLowerCase()}wins`],
        contentIdeas: [
          'Customer testimonial',
          'Case study carousel',
          'Transformation post',
        ],
      },
    ]
  }

  const prompt = `Find trending topics in the ${niche} niche for ${platform}.

Return ${count} trending topics with:
- topic: string (specific trending topic)
- platform: string
- trendScore: number (0-100, how hot the trend is)
- volume: string (estimated post count, e.g., "125K posts")
- growthRate: string (growth percentage, e.g., "+45% this week")
- recommendedHashtags: string[] (3-5 hashtags)
- contentIdeas: string[] (3 specific content ideas for this trend)

Focus on actionable, current trends. Return as JSON array.`

  try {
    const trends = await callGPTJSON<TrendingTopic[]>(
      prompt,
      'You are a social media trend analyst with expertise in hashtag research.'
    )
    return trends.slice(0, count)
  } catch (error) {
    console.error('[Hashtag Tracker] Failed to fetch trends:', error)
    return []
  }
}

/**
 * Analyze hashtags and suggest optimal mix
 */
export async function analyzeHashtags(params: {
  hashtags: string[]
  niche: string
  platform: string
}): Promise<HashtagAnalysis[]> {
  const { hashtags, niche, platform } = params

  // FALLBACK MODE
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  Hashtag analysis - using fallback')
    return hashtags.map((tag) => ({
      hashtag: tag,
      volume: '25K-100K posts',
      competition: 'medium' as const,
      relevanceScore: 7,
      recommendation: 'use' as const,
      alternatives: [`${tag}tips`, `${tag}2024`, `${tag}community`],
    }))
  }

  const prompt = `Analyze these hashtags for ${niche} content on ${platform}:

Hashtags: ${hashtags.join(', ')}

For each hashtag, provide:
- volume: string (estimated post count range)
- competition: "low" | "medium" | "high"
- relevanceScore: number (0-10)
- recommendation: "use" | "consider" | "avoid"
- alternatives: string[] (3 alternative hashtags)

Return as JSON array matching HashtagAnalysis interface.`

  try {
    return await callGPTJSON<HashtagAnalysis[]>(
      prompt,
      'You are a hashtag optimization expert.'
    )
  } catch (error) {
    console.error('[Hashtag Tracker] Analysis failed:', error)
    return []
  }
}

/**
 * Generate optimal hashtag mix for content
 */
export async function generateOptimalHashtags(params: {
  content: string
  niche: string
  platform: string
  count?: number
}): Promise<{
  hashtags: string[]
  strategy: string
  expectedReach: string
}> {
  const { content, niche, platform, count = 10 } = params

  // FALLBACK MODE
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  Hashtag generation - using fallback')
    return {
      hashtags: [
        '#marketing',
        '#socialmedia',
        `#${niche.toLowerCase()}`,
        '#contentcreation',
        '#digitalmarketing',
        '#business',
        '#entrepreneur',
        '#success',
        '#growth',
        '#trending',
      ].slice(0, count),
      strategy: '[DEMO] Mix of broad and niche hashtags for optimal reach',
      expectedReach: '10K-50K impressions',
    }
  }

  const prompt = `Generate optimal hashtag mix for this ${platform} post:

Niche: ${niche}
Content: "${content.substring(0, 200)}"
Target Count: ${count}

Provide:
- ${count} hashtags (mix of popular and niche)
- strategy: explain the hashtag strategy
- expectedReach: estimated reach range

Return JSON with: hashtags (array), strategy (string), expectedReach (string)`

  try {
    return await callGPTJSON(
      prompt,
      'You are a hashtag strategist focused on maximizing organic reach.'
    )
  } catch (error) {
    console.error('[Hashtag generation] Failed:', error)
    return {
      hashtags: [],
      strategy: 'Balanced approach',
      expectedReach: 'Varies by content quality',
    }
  }
}
