/**
 * API Route: Dynamic Branding AI
 * POST /api/marketing/branding - Apply brand styling to content
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  applyBrandStyling,
  validateBrandCompliance,
  saveBrandKit,
} from '@/lib/marketing/dynamicBranding'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId = 'demo-user-123' } = body

    if (action === 'apply-style') {
      const { content, imageDescription, platform = 'instagram' } = body

      if (!content) {
        return NextResponse.json(
          { error: 'content is required' },
          { status: 400 }
        )
      }

      const brandedContent = await applyBrandStyling({
        userId,
        content,
        imageDescription,
        platform,
      })

      return NextResponse.json({
        success: true,
        brandedContent,
      })
    }

    if (action === 'validate') {
      const { caption, imageUrl } = body

      if (!caption) {
        return NextResponse.json(
          { error: 'caption is required' },
          { status: 400 }
        )
      }

      const validation = await validateBrandCompliance({
        userId,
        caption,
        imageUrl,
      })

      return NextResponse.json({
        success: true,
        validation,
      })
    }

    if (action === 'save-brand-kit') {
      const { brandKit } = body

      if (!brandKit) {
        return NextResponse.json(
          { error: 'brandKit is required' },
          { status: 400 }
        )
      }

      const saved = await saveBrandKit({ ...brandKit, userId })

      return NextResponse.json({
        success: true,
        brandKit: saved,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('[API] Branding error:', error)
    return NextResponse.json(
      { error: 'Failed to apply branding', details: error.message },
      { status: 500 }
    )
  }
}
