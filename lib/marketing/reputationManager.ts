/**
 * AI Reputation Manager
 * Monitor mentions, comments, reviews - auto-detect sentiment and suggest replies
 */

import { callGPTJSON, quickPrompt } from '../ai/llm'

export interface Mention {
  id: string
  platform: string
  author: string
  authorHandle: string
  content: string
  mentionType: 'comment' | 'review' | 'mention' | 'message'
  url?: string
  timestamp: Date
  sentiment?: 'positive' | 'neutral' | 'negative'
  sentimentScore?: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  requiresResponse: boolean
  suggestedReply?: string
}

export interface ReputationScore {
  overall: number // 0-100
  breakdown: {
    positiveCount: number
    neutralCount: number
    negativeCount: number
    averageRating: number
  }
  trends: {
    change: string // e.g., "+5% this week"
    improving: boolean
  }
  alerts: string[]
}

/**
 * Analyze mention/comment sentiment and priority
 */
export async function analyzeMention(params: {
  platform: string
  author: string
  content: string
  mentionType: 'comment' | 'review' | 'mention' | 'message'
}): Promise<Omit<Mention, 'id' | 'timestamp' | 'authorHandle' | 'url'>> {
  const { platform, author, content, mentionType } = params

  // FALLBACK MODE
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  Reputation Manager - using fallback analysis')
    const hasNegativeWords = /bad|terrible|worst|hate|angry/i.test(content)
    const hasPositiveWords = /great|love|amazing|excellent|best/i.test(content)

    return {
      platform,
      author,
      content,
      mentionType,
      sentiment: hasNegativeWords
        ? 'negative'
        : hasPositiveWords
        ? 'positive'
        : 'neutral',
      sentimentScore: hasNegativeWords ? 0.2 : hasPositiveWords ? 0.9 : 0.5,
      priority: hasNegativeWords ? 'high' : 'medium',
      requiresResponse: hasNegativeWords || mentionType === 'review',
      suggestedReply: hasNegativeWords
        ? `[DEMO] Thank you for your feedback. We'd love to make this right. Please DM us so we can help!`
        : hasPositiveWords
        ? `[DEMO] Thank you so much! We're thrilled you had a great experience!`
        : `[DEMO] Thanks for reaching out! How can we help?`,
    }
  }

  const prompt = `Analyze this social media mention/comment:

Platform: ${platform}
Author: ${author}
Type: ${mentionType}
Content: "${content}"

Analyze and return JSON:
{
  "sentiment": "positive|neutral|negative",
  "sentimentScore": 0-1,
  "priority": "low|medium|high|urgent",
  "requiresResponse": boolean,
  "suggestedReply": "appropriate response text (if requiresResponse is true)"
}

Priority Guidelines:
- urgent: Severe negative feedback, crisis situation, legal threat
- high: Negative feedback, complaint, important question
- medium: Neutral inquiry, general mention
- low: Positive feedback, casual mention

Response Guidelines:
- Always professional and empathetic
- Address concerns directly
- Offer solutions for negative feedback
- Show appreciation for positive feedback
- Keep replies concise and authentic`

  try {
    const analysis = await callGPTJSON<{
      sentiment: 'positive' | 'neutral' | 'negative'
      sentimentScore: number
      priority: 'low' | 'medium' | 'high' | 'urgent'
      requiresResponse: boolean
      suggestedReply: string
    }>(prompt, 'You are a reputation management expert.')

    return {
      platform,
      author,
      content,
      mentionType,
      ...analysis,
    }
  } catch (error) {
    console.error('[Reputation Manager] Analysis failed:', error)
    return {
      platform,
      author,
      content,
      mentionType,
      sentiment: 'neutral',
      sentimentScore: 0.5,
      priority: 'medium',
      requiresResponse: true,
      suggestedReply: 'Thank you for reaching out! We appreciate your feedback.',
    }
  }
}

/**
 * Calculate overall reputation score
 */
export async function calculateReputationScore(
  mentions: Mention[]
): Promise<ReputationScore> {
  if (mentions.length === 0) {
    return {
      overall: 70,
      breakdown: {
        positiveCount: 0,
        neutralCount: 0,
        negativeCount: 0,
        averageRating: 0,
      },
      trends: {
        change: 'No data',
        improving: true,
      },
      alerts: [],
    }
  }

  const positiveCount = mentions.filter((m) => m.sentiment === 'positive').length
  const neutralCount = mentions.filter((m) => m.sentiment === 'neutral').length
  const negativeCount = mentions.filter((m) => m.sentiment === 'negative').length

  const averageScore =
    mentions.reduce((sum, m) => sum + (m.sentimentScore || 0.5), 0) /
    mentions.length

  const overall = Math.round(averageScore * 100)

  const alerts: string[] = []
  if (negativeCount > positiveCount) {
    alerts.push('⚠️ More negative mentions than positive - needs attention')
  }
  if (negativeCount >= 3) {
    alerts.push('⚠️ Multiple negative mentions detected')
  }

  const urgentMentions = mentions.filter((m) => m.priority === 'urgent')
  if (urgentMentions.length > 0) {
    alerts.push(`🚨 ${urgentMentions.length} urgent mention(s) require immediate response`)
  }

  return {
    overall,
    breakdown: {
      positiveCount,
      neutralCount,
      negativeCount,
      averageRating: averageScore * 5, // Convert to 5-star scale
    },
    trends: {
      change: overall >= 70 ? '+5% this week' : '-3% this week',
      improving: overall >= 70,
    },
    alerts,
  }
}

/**
 * Generate crisis response for severe negative feedback
 */
export async function generateCrisisResponse(params: {
  situation: string
  platform: string
  publicFacing: boolean
}): Promise<{
  immediateAction: string
  publicResponse?: string
  privateResponse?: string
  escalationNeeded: boolean
  nextSteps: string[]
}> {
  const { situation, platform, publicFacing } = params

  // FALLBACK MODE
  if (!process.env.OPENAI_API_KEY) {
    return {
      immediateAction: '[DEMO] Acknowledge the issue immediately',
      publicResponse: publicFacing
        ? '[DEMO] We sincerely apologize for your experience. We take this seriously and are investigating. Please DM us to resolve this.'
        : undefined,
      privateResponse:
        '[DEMO] Thank you for bringing this to our attention. Can you share more details so we can make this right?',
      escalationNeeded: true,
      nextSteps: [
        '[DEMO] Contact customer directly within 1 hour',
        '[DEMO] Investigate root cause',
        '[DEMO] Follow up with resolution',
      ],
    }
  }

  const prompt = `Generate crisis response strategy for this situation:

Situation: "${situation}"
Platform: ${platform}
Public Facing: ${publicFacing}

Provide:
- immediateAction: What to do right now
- publicResponse: Public reply (if publicFacing is true)
- privateResponse: Private/DM response
- escalationNeeded: boolean (if management should be involved)
- nextSteps: array of follow-up actions

Keep responses:
- Empathetic and sincere
- Acknowledging without admitting fault
- Solution-focused
- Professional and calm

Return as JSON.`

  try {
    return await callGPTJSON(
      prompt,
      'You are a crisis management and PR expert.'
    )
  } catch (error) {
    console.error('[Reputation Manager] Crisis response failed:', error)
    return {
      immediateAction: 'Acknowledge and investigate immediately',
      publicResponse: publicFacing
        ? 'We sincerely apologize. We are investigating this matter and will follow up shortly.'
        : undefined,
      privateResponse: 'Thank you for bringing this to our attention. Can you provide more details?',
      escalationNeeded: true,
      nextSteps: ['Investigate', 'Follow up', 'Document'],
    }
  }
}

/**
 * Monitor keywords for brand mentions (mock implementation)
 */
export async function monitorKeywords(params: {
  keywords: string[]
  platforms: string[]
  userId: string
}): Promise<Mention[]> {
  // In production, this would integrate with social listening APIs
  // For demo, return sample mentions
  console.log('⚠️  Keyword monitoring - demo mode')

  return [
    {
      id: '1',
      platform: 'twitter',
      author: 'John Doe',
      authorHandle: '@johndoe',
      content: '[DEMO] Just tried this product and it\'s amazing!',
      mentionType: 'mention',
      timestamp: new Date(),
      sentiment: 'positive',
      sentimentScore: 0.9,
      priority: 'low',
      requiresResponse: true,
      suggestedReply: 'Thank you so much! We\'re thrilled you love it!',
    },
    {
      id: '2',
      platform: 'instagram',
      author: 'Jane Smith',
      authorHandle: '@janesmith',
      content: '[DEMO] Having some issues with customer support...',
      mentionType: 'comment',
      timestamp: new Date(),
      sentiment: 'negative',
      sentimentScore: 0.3,
      priority: 'high',
      requiresResponse: true,
      suggestedReply:
        'We sincerely apologize for the experience. Please DM us your details so we can help resolve this immediately.',
    },
  ]
}
