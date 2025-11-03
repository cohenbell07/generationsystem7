/**
 * API Route: AI Marketing Brain
 * POST /api/marketing/brain - Analyze marketing strategy and generate recommendations
 */

import { NextRequest, NextResponse } from 'next/server'
import { analyzeMarketingStrategy, generateWeeklyReport } from '@/lib/marketing/marketingBrain'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = 'demo-user-123', timeframe = 'week', action = 'analyze' } = body

    if (action === 'weekly-report') {
      const report = await generateWeeklyReport(userId)
      return NextResponse.json({ success: true, report })
    }

    const analysis = await analyzeMarketingStrategy({ userId, timeframe })

    return NextResponse.json({
      success: true,
      analysis,
      generatedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('[API] Marketing Brain error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze marketing strategy', details: error.message },
      { status: 500 }
    )
  }
}
