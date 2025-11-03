/**
 * API Route: Auto-Iterate A/B Testing
 * POST /api/marketing/autoiterate - Create and analyze A/B tests
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  createABTestVariations,
  analyzeABTest,
  optimizeFromTestResults,
} from '@/lib/marketing/autoIterate'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId = 'demo-user-123' } = body

    if (action === 'create-variations') {
      const { originalCaption, imageUrl, platform, testType = 'caption' } = body

      if (!originalCaption) {
        return NextResponse.json(
          { error: 'originalCaption is required' },
          { status: 400 }
        )
      }

      const variants = await createABTestVariations({
        userId,
        originalCaption,
        imageUrl,
        platform: platform || 'instagram',
        testType,
      })

      return NextResponse.json({
        success: true,
        variants,
        testType,
      })
    }

    if (action === 'analyze-test') {
      const { testId, variants } = body

      if (!testId || !variants) {
        return NextResponse.json(
          { error: 'testId and variants are required' },
          { status: 400 }
        )
      }

      const results = await analyzeABTest(testId, variants)

      return NextResponse.json({
        success: true,
        results,
      })
    }

    if (action === 'optimize-content') {
      const { recentTests, newContent } = body

      if (!newContent) {
        return NextResponse.json(
          { error: 'newContent is required' },
          { status: 400 }
        )
      }

      const optimized = await optimizeFromTestResults({
        userId,
        recentTests: recentTests || [],
        newContent,
      })

      return NextResponse.json({
        success: true,
        optimizedContent: optimized,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('[API] Auto-Iterate error:', error)
    return NextResponse.json(
      { error: 'Failed to process A/B test', details: error.message },
      { status: 500 }
    )
  }
}
