import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId = 'demo-user-123',
      assetId,
      platform,
      caption,
      tags,
      scheduledAt,
    } = body

    if (!platform || !caption) {
      return NextResponse.json(
        { error: 'Missing required fields: platform, caption' },
        { status: 400 }
      )
    }

    console.log(`\n📅 Scheduling post:`)
    console.log(`   Platform: ${platform}`)
    console.log(`   Caption: "${caption.slice(0, 50)}..."`)
    console.log(`   Scheduled: ${scheduledAt || 'Now'}`)

    const post = await prisma.postDraft.create({
      data: {
        userId,
        assetId: assetId || null,
        platform,
        caption,
        tags: tags ? JSON.stringify(tags) : null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: scheduledAt ? 'scheduled' : 'draft',
      },
      include: {
        asset: true,
      },
    })

    console.log(`✅ Post scheduled successfully: ${post.id}`)

    return NextResponse.json({
      success: true,
      post,
    })

  } catch (error: any) {
    console.error('❌ Post scheduling error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Post scheduling failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user-123'
    const status = searchParams.get('status')

    const posts = await prisma.postDraft.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      include: {
        asset: true,
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    })

    return NextResponse.json({ posts })

  } catch (error: any) {
    console.error('❌ Error fetching posts:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
