/**
 * API Route: Competitor Intelligence
 * POST /api/marketing/competitors - Analyze competitors
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  analyzeCompetitor,
  compareToCompetitors,
  trackCompetitorUpdates,
} from '@/lib/marketing/competitorIntel'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'analyze') {
      const { competitorName, competitorHandle, platform, samplePosts = [] } = body

      if (!competitorName || !competitorHandle) {
        return NextResponse.json(
          { error: 'competitorName and competitorHandle are required' },
          { status: 400 }
        )
      }

      const analysis = await analyzeCompetitor({
        competitorName,
        competitorHandle,
        platform: platform || 'instagram',
        samplePosts,
      })

      return NextResponse.json({
        success: true,
        analysis,
      })
    }

    if (action === 'compare') {
      const { yourMetrics, competitorMetrics } = body

      if (!yourMetrics || !competitorMetrics) {
        return NextResponse.json(
          { error: 'yourMetrics and competitorMetrics are required' },
          { status: 400 }
        )
      }

      const comparison = await compareToCompetitors({
        yourMetrics,
        competitorMetrics,
      })

      return NextResponse.json({
        success: true,
        comparison,
      })
    }

    if (action === 'track-updates') {
      const { competitorId } = body

      if (!competitorId) {
        return NextResponse.json(
          { error: 'competitorId is required' },
          { status: 400 }
        )
      }

      const updates = await trackCompetitorUpdates(competitorId)

      return NextResponse.json({
        success: true,
        updates,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('[API] Competitor Intel error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze competitor', details: error.message },
      { status: 500 }
    )
  }
}
