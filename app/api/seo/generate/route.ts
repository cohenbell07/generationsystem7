import { NextRequest, NextResponse } from 'next/server'
import { generateSEO } from '@/lib/seo/generate'
import { calculateSEOScore } from '@/lib/seo/score'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      platform,
      topic,
      tone = 'neutral',
      userId = 'demo-user-123',
    } = body

    if (!platform || !topic) {
      return NextResponse.json(
        { error: 'Missing required fields: platform, topic' },
        { status: 400 }
      )
    }

    console.log(`\n📝 SEO generation request:`)
    console.log(`   Platform: ${platform}`)
    console.log(`   Topic: "${topic}"`)
    console.log(`   Tone: ${tone}`)

    // Step 1: Generate SEO content
    const seoOutput = await generateSEO({
      platform,
      topic,
      tone,
      // TODO: Add external signals here if API keys are configured
    })

    // Step 2: Calculate SEO score
    const scoreResult = calculateSEOScore(seoOutput, platform, topic)

    // Step 3: Save to database
    // Note: Store hashtags, metaDescription, and metaKeywords if available
    const seoPreset = await prisma.sEOPreset.create({
      data: {
        userId,
        platform,
        topic,
        title: seoOutput.title,
        description: seoOutput.metaDescription || seoOutput.description || '',
        tags: JSON.stringify([...seoOutput.tags, ...(seoOutput.hashtags || []), ...(seoOutput.suggestedHashtags || [])]),
        caption: seoOutput.caption,
        score: scoreResult.score,
        reasons: JSON.stringify(scoreResult.reasons),
        improvements: JSON.stringify(scoreResult.improvements),
      },
    })

    console.log(`✅ SEO content generated with score: ${scoreResult.score}/100`)

    return NextResponse.json({
      success: true,
      seoPreset,
      ...seoOutput,
      scoreResult,
    })

  } catch (error: any) {
    console.error('❌ SEO generation error:', error.message)
    return NextResponse.json(
      { error: error.message || 'SEO generation failed' },
      { status: 500 }
    )
  }
}
