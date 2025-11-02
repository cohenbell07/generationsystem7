/**
 * CRM & Lead Nurture System
 * AI-powered lead scoring, tracking, and automated responses
 */

import { db } from '../db'
import { callGPTJSON, quickPrompt } from '../ai/llm'

// ============================================
// Types
// ============================================

export interface LeadScoringFactors {
  source: number // 0-25 points
  engagement: number // 0-25 points
  timing: number // 0-25 points
  intent: number // 0-25 points
}

export interface AutoResponseSuggestion {
  message: string
  tone: 'friendly' | 'professional' | 'helpful'
  followUpIn: number // hours
  tags: string[]
}

// ============================================
// Lead Scoring
// ============================================

/**
 * Score a lead using AI + heuristics
 */
export async function scoreLead(params: {
  source: string
  platform?: string
  message?: string
  previousInteractions?: number
  responseTime?: number // hours
}): Promise<{ score: number; factors: LeadScoringFactors; reasoning: string }> {
  const { source, platform, message, previousInteractions = 0, responseTime } = params

  // Base scoring rules
  const sourceScore = getSourceScore(source)
  const engagementScore = getEngagementScore(previousInteractions)
  const timingScore = getTimingScore(responseTime)

  // AI-based intent analysis
  const intentScore = message ? await analyzeIntent(message) : 10

  const factors: LeadScoringFactors = {
    source: sourceScore,
    engagement: engagementScore,
    timing: timingScore,
    intent: intentScore,
  }

  const totalScore = Math.min(
    100,
    sourceScore + engagementScore + timingScore + intentScore
  )

  const reasoning = `Score: ${totalScore}/100. Source: ${sourceScore}, Engagement: ${engagementScore}, Timing: ${timingScore}, Intent: ${intentScore}`

  return { score: totalScore, factors, reasoning }
}

/**
 * Score by lead source (higher value sources get more points)
 */
function getSourceScore(source: string): number {
  const sourceValues: Record<string, number> = {
    website_form: 25, // Highest intent
    email: 20,
    linkedin_dm: 18,
    instagram_dm: 15,
    facebook_dm: 15,
    tiktok_comment: 10,
    instagram_comment: 10,
    organic_search: 20,
    paid_ad: 18,
    referral: 22,
    other: 5,
  }

  return sourceValues[source] || 10
}

/**
 * Score by engagement history
 */
function getEngagementScore(interactions: number): number {
  if (interactions === 0) return 5
  if (interactions === 1) return 10
  if (interactions <= 3) return 15
  if (interactions <= 5) return 20
  return 25 // Highly engaged
}

/**
 * Score by response timing
 */
function getTimingScore(responseTime?: number): number {
  if (!responseTime) return 10

  // Faster response = higher score
  if (responseTime < 1) return 25 // Within 1 hour
  if (responseTime < 4) return 20 // Within 4 hours
  if (responseTime < 24) return 15 // Same day
  if (responseTime < 48) return 10 // Within 2 days
  return 5 // Delayed response
}

/**
 * Analyze message intent with AI
 */
async function analyzeIntent(message: string): Promise<number> {
  try {
    const prompt = `Analyze this lead message and score their purchase intent (0-25):

Message: "${message}"

Consider:
- Urgency indicators
- Specific questions
- Budget mentions
- Decision-making language

Return JSON: { "score": 0-25, "reasoning": "why" }`

    const result = await callGPTJSON<{ score: number; reasoning: string }>(
      prompt,
      'You are a sales intent analyzer.'
    )

    return Math.min(25, Math.max(0, result.score))
  } catch (error) {
    console.error('[CRM] Intent analysis failed:', error)
    return 10 // Default mid-range
  }
}

// ============================================
// Auto-Response Generation
// ============================================

/**
 * Generate AI-powered response to lead
 */
export async function generateLeadResponse(params: {
  leadName?: string
  leadMessage: string
  businessContext: string
  previousContext?: string
  responseGoal: 'qualify' | 'book_appointment' | 'answer_question' | 'nurture'
}): Promise<AutoResponseSuggestion> {
  const { leadName, leadMessage, businessContext, previousContext, responseGoal } = params

  const prompt = `You are a helpful business representative. Generate a response to this lead.

Business Context: ${businessContext}
Lead Name: ${leadName || 'there'}
Their Message: "${leadMessage}"
${previousContext ? `Previous Context: ${previousContext}` : ''}
Goal: ${responseGoal}

Generate a response that:
- Is friendly and professional
- Addresses their question/concern
- ${responseGoal === 'book_appointment' ? 'Encourages booking a call/meeting' : ''}
- ${responseGoal === 'qualify' ? 'Asks qualifying questions' : ''}
- Feels human, not robotic

Return JSON:
{
  "message": "the response text",
  "tone": "friendly|professional|helpful",
  "followUpIn": hours,
  "tags": ["relevant", "tags"]
}`

  try {
    return await callGPTJSON<AutoResponseSuggestion>(
      prompt,
      'You are an expert sales and customer service representative.'
    )
  } catch (error) {
    console.error('[CRM] Response generation failed:', error)

    // Fallback generic response
    return {
      message: `Hi${leadName ? ` ${leadName}` : ''}! Thank you for reaching out. I'd be happy to help you with that. When would be a good time to chat?`,
      tone: 'friendly',
      followUpIn: 24,
      tags: ['general_inquiry'],
    }
  }
}

// ============================================
// Lead Nurture Campaigns
// ============================================

/**
 * Generate follow-up sequence for lead nurturing
 */
export async function generateNurtureSequence(params: {
  leadStatus: string
  leadScore: number
  industry: string
  lastContact: Date
}): Promise<{
  shouldContact: boolean
  timing: string
  message: string
  channel: string
}[]> {
  const { leadStatus, leadScore, industry, lastContact } = params

  const daysSinceContact = Math.floor(
    (Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24)
  )

  const prompt = `Create a lead nurture sequence for this prospect:

Lead Status: ${leadStatus}
Lead Score: ${leadScore}/100
Industry: ${industry}
Days Since Last Contact: ${daysSinceContact}

Generate a 3-step follow-up sequence with:
- Optimal timing (e.g., "2 days", "1 week")
- Message content
- Recommended channel (email, DM, call)

Return JSON array:
[{
  "shouldContact": true/false,
  "timing": "when to send",
  "message": "message content",
  "channel": "email|dm|call"
}]`

  try {
    return await callGPTJSON(prompt, 'You are a lead nurture expert.')
  } catch (error) {
    console.error('[CRM] Nurture sequence failed:', error)
    return []
  }
}

// ============================================
// Sentiment Analysis
// ============================================

/**
 * Analyze sentiment of lead interaction
 */
export async function analyzeSentiment(
  message: string
): Promise<{ sentiment: 'positive' | 'neutral' | 'negative'; score: number }> {
  try {
    const prompt = `Analyze the sentiment of this message:

"${message}"

Return JSON:
{
  "sentiment": "positive|neutral|negative",
  "score": 0-1 (0=very negative, 0.5=neutral, 1=very positive)
}`

    const result = await callGPTJSON<{
      sentiment: 'positive' | 'neutral' | 'negative'
      score: number
    }>(prompt, 'You are a sentiment analysis expert.')

    return result
  } catch (error) {
    console.error('[CRM] Sentiment analysis failed:', error)
    return { sentiment: 'neutral', score: 0.5 }
  }
}

// ============================================
// Lead Management Helpers
// ============================================

/**
 * Create or update lead in database
 */
export async function upsertLead(params: {
  userId: string
  name?: string
  email?: string
  phone?: string
  source: string
  platform?: string
  platformUserId?: string
  initialMessage?: string
}) {
  const { userId, name, email, phone, source, platform, platformUserId, initialMessage } =
    params

  // Score the lead
  const scoreResult = await scoreLead({
    source,
    platform,
    message: initialMessage,
  })

  // Check if lead exists
  const existing = await db.lead.findFirst({
    where: {
      userId,
      OR: [
        { email: email || undefined },
        { phone: phone || undefined },
        {
          AND: [
            { platform: platform || undefined },
            { platformUserId: platformUserId || undefined },
          ],
        },
      ],
    },
  })

  if (existing) {
    // Update existing lead
    return await db.lead.update({
      where: { id: existing.id },
      data: {
        score: scoreResult.score,
        scoreFactors: JSON.stringify(scoreResult.factors),
        lastContactedAt: new Date(),
      },
    })
  } else {
    // Create new lead
    return await db.lead.create({
      data: {
        userId,
        name,
        email,
        phone,
        source,
        platform,
        platformUserId,
        score: scoreResult.score,
        scoreFactors: JSON.stringify(scoreResult.factors),
        status: 'new',
      },
    })
  }
}

/**
 * Log lead interaction
 */
export async function logInteraction(params: {
  leadId: string
  type: string
  platform?: string
  message?: string
  response?: string
  isAutomated?: boolean
}) {
  const { leadId, type, platform, message, response, isAutomated = false } = params

  // Analyze sentiment if there's a response
  let sentiment: 'positive' | 'neutral' | 'negative' | undefined
  if (response) {
    const analysis = await analyzeSentiment(response)
    sentiment = analysis.sentiment
  }

  return await db.leadInteraction.create({
    data: {
      leadId,
      type,
      platform,
      message,
      response,
      isAutomated,
      sentiment,
    },
  })
}

/**
 * Get lead statistics for user
 */
export async function getLeadStats(userId: string) {
  const leads = await db.lead.findMany({
    where: { userId },
    include: { interactions: true },
  })

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    qualified: leads.filter((l) => l.status === 'qualified').length,
    converted: leads.filter((l) => l.status === 'converted').length,
    avgScore: leads.reduce((sum, l) => sum + l.score, 0) / (leads.length || 1),
    topSources: getTopSources(leads),
    recentLeads: leads.slice(-10).reverse(),
  }

  return stats
}

function getTopSources(leads: any[]): Record<string, number> {
  const sources: Record<string, number> = {}
  leads.forEach((lead) => {
    sources[lead.source] = (sources[lead.source] || 0) + 1
  })
  return sources
}
