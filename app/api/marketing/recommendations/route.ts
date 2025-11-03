/**
 * API Route: Recommendations Dashboard
 * POST /api/marketing/recommendations - Get AI-powered recommendations and track goals
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  generateRecommendations,
  trackGoals,
  getQuickWins,
} from '@/lib/marketing/recommendations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId = 'demo-user-123' } = body

    if (action === 'generate') {
      const { contentAnalysis, recentPosts, goals = [] } = body

      const recommendations = await generateRecommendations({
        userId,
        contentAnalysis,
        recentPosts,
        goals,
      })

      return NextResponse.json({
        success: true,
        recommendations,
        count: recommendations.length,
      })
    }

    if (action === 'track-goals') {
      const { goals } = body

      if (!goals || !Array.isArray(goals)) {
        return NextResponse.json(
          { error: 'goals array is required' },
          { status: 400 }
        )
      }

      const progress = await trackGoals({ userId, goals })

      return NextResponse.json({
        success: true,
        goalProgress: progress,
      })
    }

    if (action === 'quick-wins') {
      const quickWins = await getQuickWins(userId)

      return NextResponse.json({
        success: true,
        quickWins,
        count: quickWins.length,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('[API] Recommendations error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations', details: error.message },
      { status: 500 }
    )
  }
}
