/**
 * API Route: Reputation Manager
 * POST /api/marketing/reputation - Monitor mentions and manage reputation
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  analyzeMention,
  calculateReputationScore,
  generateCrisisResponse,
  monitorKeywords,
} from '@/lib/marketing/reputationManager'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId = 'demo-user-123' } = body

    if (action === 'analyze-mention') {
      const { platform, author, content, mentionType = 'comment' } = body

      if (!platform || !author || !content) {
        return NextResponse.json(
          { error: 'platform, author, and content are required' },
          { status: 400 }
        )
      }

      const analysis = await analyzeMention({
        platform,
        author,
        content,
        mentionType,
      })

      return NextResponse.json({
        success: true,
        mention: {
          ...analysis,
          id: `mention-${Date.now()}`,
          timestamp: new Date(),
        },
      })
    }

    if (action === 'calculate-score') {
      const { mentions } = body

      if (!mentions || !Array.isArray(mentions)) {
        return NextResponse.json(
          { error: 'mentions array is required' },
          { status: 400 }
        )
      }

      const score = await calculateReputationScore(mentions)

      return NextResponse.json({
        success: true,
        score,
      })
    }

    if (action === 'crisis-response') {
      const { situation, platform, publicFacing = true } = body

      if (!situation) {
        return NextResponse.json(
          { error: 'situation is required' },
          { status: 400 }
        )
      }

      const response = await generateCrisisResponse({
        situation,
        platform: platform || 'instagram',
        publicFacing,
      })

      return NextResponse.json({
        success: true,
        crisisResponse: response,
      })
    }

    if (action === 'monitor') {
      const { keywords, platforms } = body

      if (!keywords || !Array.isArray(keywords)) {
        return NextResponse.json(
          { error: 'keywords array is required' },
          { status: 400 }
        )
      }

      const mentions = await monitorKeywords({
        keywords,
        platforms: platforms || ['instagram', 'twitter', 'facebook'],
        userId,
      })

      return NextResponse.json({
        success: true,
        mentions,
        count: mentions.length,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('[API] Reputation Manager error:', error)
    return NextResponse.json(
      { error: 'Failed to process reputation request', details: error.message },
      { status: 500 }
    )
  }
}
