/**
 * Auto-Iterate A/B Testing System
 * Automatically test variations, track results, and optimize content
 */

import { callGPTJSON } from '../ai/llm'
import { db } from '../db'

export interface ABTestVariant {
  id: string
  variantName: 'A' | 'B' | 'C'
  caption: string
  imageUrl?: string
  hashtags: string[]
  postingTime?: Date
  metrics?: {
    impressions: number
    engagement: number
    clicks: number
    shares: number
  }
}

export interface ABTestResult {
  testId: string
  testType: 'caption' | 'image' | 'timing' | 'hashtags'
  winner: 'A' | 'B' | 'C' | 'inconclusive'
  confidence: number
  insights: string
  recommendation: string
  variants: ABTestVariant[]
}

/**
 * Create A/B test variations automatically
 */
export async function createABTestVariations(params: {
  userId: string
  originalCaption: string
  imageUrl?: string
  platform: string
  testType: 'caption' | 'image' | 'timing' | 'hashtags'
}): Promise<ABTestVariant[]> {
  const { originalCaption, imageUrl, platform, testType } = params

  // FALLBACK MODE
  if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    console.log('⚠️  Auto-Iterate - using fallback test variations')
    return [
      {
        id: 'variant-a',
        variantName: 'A',
        caption: `${originalCaption} [DEMO Variant A]`,
        imageUrl,
        hashtags: ['#demo', '#variantA', '#marketing'],
      },
      {
        id: 'variant-b',
        variantName: 'B',
        caption: `${originalCaption} [DEMO Variant B - More CTA]`,
        imageUrl,
        hashtags: ['#demo', '#variantB', '#growth'],
      },
    ]
  }

  const prompt = `Create A/B test variations for ${platform} post.

Test Type: ${testType}
Original Caption: "${originalCaption}"
Has Image: ${imageUrl ? 'yes' : 'no'}

Generate 2-3 variations (A, B, optionally C) testing different ${testType} strategies.

For caption tests: Try different hooks, CTAs, emoji usage
For hashtag tests: Try different hashtag strategies
For timing tests: Suggest different posting times
For image tests: Describe variations in image composition

Return JSON array of variants with:
- variantName: "A" | "B" | "C"
- caption: string
- hashtags: string[]
- postingTime?: ISO date string (for timing tests)

Keep variations distinct but similar in quality.`

  try {
    const variations = await callGPTJSON<
      Omit<ABTestVariant, 'id' | 'imageUrl'>[]
    >(prompt, 'You are an A/B testing expert.')

    return variations.map((v, i) => ({
      ...v,
      id: `variant-${v.variantName.toLowerCase()}`,
      imageUrl,
    }))
  } catch (error) {
    console.error('[Auto-Iterate] Failed to create variations:', error)
    return [
      {
        id: 'variant-a',
        variantName: 'A',
        caption: originalCaption,
        imageUrl,
        hashtags: ['#marketing', '#original'],
      },
    ]
  }
}

/**
 * Analyze A/B test results
 */
export async function analyzeABTest(
  testId: string,
  variants: ABTestVariant[]
): Promise<ABTestResult> {
  // FALLBACK MODE
  if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    console.log('⚠️  Auto-Iterate analysis - using fallback results')
    return {
      testId,
      testType: 'caption',
      winner: 'B',
      confidence: 0.75,
      insights: '[DEMO] Variant B had 25% higher engagement. Stronger CTA performed better.',
      recommendation: '[DEMO] Use more direct CTAs in future posts',
      variants,
    }
  }

  const prompt = `Analyze this A/B test results:

Test ID: ${testId}
Variants:
${JSON.stringify(
  variants.map((v) => ({
    name: v.variantName,
    caption: v.caption.substring(0, 100),
    metrics: v.metrics,
  })),
  null,
  2
)}

Determine:
1. Which variant won (A, B, C, or inconclusive if not enough data)
2. Confidence level (0-1)
3. Key insights from the test
4. Actionable recommendation for future content

Return JSON with: testType, winner, confidence, insights, recommendation`

  try {
    const analysis = await callGPTJSON<
      Omit<ABTestResult, 'testId' | 'variants'>
    >(
      prompt,
      'You are a data scientist specializing in A/B testing and social media analytics.'
    )

    return {
      ...analysis,
      testId,
      variants,
    }
  } catch (error) {
    console.error('[Auto-Iterate] Analysis failed:', error)
    return {
      testId,
      testType: 'caption',
      winner: 'inconclusive',
      confidence: 0.5,
      insights: 'Not enough data to determine winner',
      recommendation: 'Continue testing with larger sample size',
      variants,
    }
  }
}

/**
 * Auto-optimize future content based on test results
 */
export async function optimizeFromTestResults(params: {
  userId: string
  recentTests: ABTestResult[]
  newContent: string
}): Promise<string> {
  const { recentTests, newContent } = params

  // FALLBACK MODE
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  Auto-optimize - using fallback')
    return `${newContent} [Optimized based on demo insights]`
  }

  const learnings = recentTests
    .map((t) => `${t.testType}: ${t.insights} → ${t.recommendation}`)
    .join('\n')

  const prompt = `Optimize this new content based on A/B test learnings:

Recent Test Learnings:
${learnings}

New Content:
"${newContent}"

Apply the learnings to improve this content. Return the optimized version.`

  try {
    const response = await callGPTJSON<{ optimizedContent: string }>(
      prompt,
      'You are a content optimization expert.'
    )
    return response.optimizedContent
  } catch (error) {
    console.error('[Auto-Iterate] Optimization failed:', error)
    return newContent
  }
}
