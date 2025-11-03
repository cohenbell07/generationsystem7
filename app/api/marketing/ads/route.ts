/**
 * API Route: AI Ad Manager
 * POST /api/marketing/ads - Convert organic to paid ads, manage campaigns
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  convertToAdCreative,
  generateCampaignStrategy,
  analyzeAdPerformance,
} from '@/lib/marketing/adManager'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'convert-to-ad') {
      const { organicCaption, imageUrl, platform = 'meta', objective = 'engagement' } = body

      if (!organicCaption) {
        return NextResponse.json(
          { error: 'organicCaption is required' },
          { status: 400 }
        )
      }

      const creative = await convertToAdCreative({
        organicCaption,
        imageUrl: imageUrl || 'https://via.placeholder.com/1080',
        platform,
        objective,
      })

      return NextResponse.json({
        success: true,
        creative,
      })
    }

    if (action === 'generate-strategy') {
      const { businessType, goal, budget, platform = 'meta' } = body

      if (!businessType || !goal || !budget) {
        return NextResponse.json(
          { error: 'businessType, goal, and budget are required' },
          { status: 400 }
        )
      }

      const strategy = await generateCampaignStrategy({
        businessType,
        goal,
        budget: parseFloat(budget),
        platform,
      })

      return NextResponse.json({
        success: true,
        strategy,
      })
    }

    if (action === 'analyze-performance') {
      const { campaign } = body

      if (!campaign) {
        return NextResponse.json(
          { error: 'campaign data is required' },
          { status: 400 }
        )
      }

      const analysis = await analyzeAdPerformance(campaign)

      return NextResponse.json({
        success: true,
        analysis,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('[API] Ad Manager error:', error)
    return NextResponse.json(
      { error: 'Failed to process ad request', details: error.message },
      { status: 500 }
    )
  }
}
