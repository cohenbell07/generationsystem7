/**
 * API Route: Hashtag & Trend Tracker
 * POST /api/marketing/hashtags - Get trending topics and optimize hashtags
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  getTrendingTopics,
  analyzeHashtags,
  generateOptimalHashtags,
} from '@/lib/marketing/hashtags'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'trending-topics') {
      const { niche, platform = 'instagram', count = 10 } = body

      if (!niche) {
        return NextResponse.json(
          { error: 'niche is required' },
          { status: 400 }
        )
      }

      const trends = await getTrendingTopics({ niche, platform, count })

      return NextResponse.json({
        success: true,
        trends,
        niche,
        platform,
      })
    }

    if (action === 'analyze') {
      const { hashtags, niche, platform = 'instagram' } = body

      if (!hashtags || !Array.isArray(hashtags)) {
        return NextResponse.json(
          { error: 'hashtags array is required' },
          { status: 400 }
        )
      }

      const analysis = await analyzeHashtags({
        hashtags,
        niche: niche || 'general',
        platform,
      })

      return NextResponse.json({
        success: true,
        analysis,
      })
    }

    if (action === 'generate') {
      const { content, niche, platform = 'instagram', count = 10 } = body

      if (!content) {
        return NextResponse.json(
          { error: 'content is required' },
          { status: 400 }
        )
      }

      const result = await generateOptimalHashtags({
        content,
        niche: niche || 'general',
        platform,
        count,
      })

      return NextResponse.json({
        success: true,
        ...result,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('[API] Hashtags error:', error)
    return NextResponse.json(
      { error: 'Failed to process hashtags', details: error.message },
      { status: 500 }
    )
  }
}
