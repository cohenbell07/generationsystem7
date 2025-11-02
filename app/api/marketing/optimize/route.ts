/**
 * API Route: Marketing Optimization
 * POST /api/marketing/optimize - Get optimal posting times, content suggestions, performance predictions
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  getOptimalPostTimes,
  optimizeContent,
  predictPerformance,
} from '@/lib/marketing/optimizer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, ...params } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // ============================================
    // Action: Get Optimal Posting Times
    // ============================================
    if (action === 'timing') {
      const { platform, contentType, targetAudience } = params

      if (!platform) {
        return NextResponse.json(
          { error: 'platform is required for timing optimization' },
          { status: 400 }
        )
      }

      const optimalTimes = await getOptimalPostTimes({
        userId,
        platform,
        contentType: contentType || 'image',
        targetAudience,
      })

      return NextResponse.json({
        success: true,
        optimalTimes,
        platform,
        recommendations: optimalTimes.slice(0, 3), // Top 3 times
      })
    }

    // ============================================
    // Action: Optimize Content
    // ============================================
    if (action === 'content') {
      const { caption, platform, imageUrl, hasVideo, targetGoal } = params

      if (!caption || !platform) {
        return NextResponse.json(
          { error: 'caption and platform are required for content optimization' },
          { status: 400 }
        )
      }

      const optimization = await optimizeContent({
        caption,
        platform,
        imageUrl,
        hasVideo,
        targetGoal,
      })

      return NextResponse.json({
        success: true,
        optimization,
        summary: {
          score: optimization.score,
          predictedEngagement: optimization.predictedEngagement,
          topRecommendations: optimization.recommendations.slice(0, 3),
        },
      })
    }

    // ============================================
    // Action: Predict Performance
    // ============================================
    if (action === 'predict') {
      const { platform, caption, contentType, hasVideo, scheduledTime } = params

      if (!platform || !caption) {
        return NextResponse.json(
          { error: 'platform and caption are required for prediction' },
          { status: 400 }
        )
      }

      const prediction = await predictPerformance({
        userId,
        platform,
        caption,
        contentType: contentType || 'image',
        hasVideo: hasVideo || false,
        scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined,
      })

      return NextResponse.json({
        success: true,
        prediction,
        summary: {
          impressions: `${prediction.estimatedImpressions.min.toLocaleString()} - ${prediction.estimatedImpressions.max.toLocaleString()}`,
          engagement: `${prediction.estimatedEngagement.min.toFixed(1)}% - ${prediction.estimatedEngagement.max.toFixed(1)}%`,
          conversionScore: `${prediction.conversionScore}/10`,
          confidence: `${(prediction.confidence * 100).toFixed(0)}%`,
        },
      })
    }

    // ============================================
    // Invalid Action
    // ============================================
    return NextResponse.json(
      { error: 'Invalid action. Use: timing, content, or predict' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('[API] Marketing optimize error:', error)
    return NextResponse.json(
      { error: 'Optimization failed', details: error.message },
      { status: 500 }
    )
  }
}

// ============================================
// GET - Get Optimization History
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // In a full implementation, you'd fetch optimization history from DB
    // For now, return sample data structure

    return NextResponse.json({
      success: true,
      message: 'Optimization history feature coming soon',
      usage: {
        timingChecks: 0,
        contentOptimizations: 0,
        predictions: 0,
      },
    })
  } catch (error: any) {
    console.error('[API] Marketing optimize GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch optimization history' },
      { status: 500 }
    )
  }
}
