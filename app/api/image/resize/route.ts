import { NextRequest, NextResponse } from 'next/server'
import { resizeToPreset } from '@/lib/ai/composite'
import { saveFile } from '@/lib/storage'
import { prisma } from '@/lib/db'
import { generateFilename } from '@/lib/utils'
import { PLATFORM_PRESETS } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { assetId, targetPlatform } = body

    if (!assetId || !targetPlatform) {
      return NextResponse.json(
        { error: 'Missing required fields: assetId, targetPlatform' },
        { status: 400 }
      )
    }

    // Get original asset
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
    })

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    // Get target preset
    const preset = PLATFORM_PRESETS[targetPlatform as keyof typeof PLATFORM_PRESETS]
    if (!preset) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
    }

    // Resize image
    const resizedBuffer = await resizeToPreset(
      asset.url,
      preset.width,
      preset.height
    )

    // Save resized image
    const filename = generateFilename('resized.png', targetPlatform)
    const resizedPath = await saveFile(resizedBuffer, filename, 'images')

    // Save to database
    const resizedAsset = await prisma.asset.create({
      data: {
        userId: asset.userId,
        url: resizedPath,
        filename: resizedPath.split('/').pop() || '',
        model: asset.model,
        prompt: `${asset.prompt} (resized for ${preset.name})`,
        width: preset.width,
        height: preset.height,
        platform: targetPlatform,
        costEstimate: asset.costEstimate,
      },
    })

    return NextResponse.json({
      success: true,
      asset: resizedAsset,
    })
  } catch (error: any) {
    console.error('❌ Resize error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Resize failed' },
      { status: 500 }
    )
  }
}

