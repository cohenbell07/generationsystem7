import OpenAI from 'openai'
import { getPlatformProfile } from './platformProfiles'

/**
 * SEO Content Generation
 *
 * Uses OpenAI to generate platform-specific content
 * TODO: Add Claude API support as alternative
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export interface GenerateSEOOptions {
  platform: string
  topic: string
  tone?: 'neutral' | 'playful' | 'luxury' | 'authoritative'
  externalSignals?: {
    trendingKeywords?: string[]
    competitorTitles?: string[]
    searchVolume?: Record<string, number>
  }
}

export interface SEOOutput {
  title: string
  description: string
  tags: string[]
  caption: string
  keywords: string[]
  hashtags: string[] // Platform-specific hashtags
  metaDescription?: string // For blog/SEO content
  metaKeywords?: string[] // Additional meta keywords
  suggestedHashtags?: string[] // Trending/popular hashtags
}

/**
 * Generate platform-specific SEO content
 */
export async function generateSEO(options: GenerateSEOOptions): Promise<SEOOutput> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set. Please add it to your .env file.')
  }

  const { platform, topic, tone = 'neutral', externalSignals } = options

  const profile = getPlatformProfile(platform)
  if (!profile) {
    throw new Error(`Unknown platform: ${platform}`)
  }

  console.log(`📝 Generating SEO content for ${profile.name}...`)
  console.log(`   Topic: "${topic}"`)
  console.log(`   Tone: ${tone}`)

  // Build context from external signals if available
  let signalsContext = ''
  if (externalSignals) {
    if (externalSignals.trendingKeywords?.length) {
      signalsContext += `\nTrending keywords: ${externalSignals.trendingKeywords.join(', ')}`
    }
    if (externalSignals.competitorTitles?.length) {
      signalsContext += `\nTop-performing titles: ${externalSignals.competitorTitles.slice(0, 3).join('; ')}`
    }
  }

  const systemPrompt = `You are an expert SEO and social media content strategist.

Generate optimized content for ${profile.name} based on the user's topic.

Platform: ${profile.name}
Tag Format: ${profile.tagFormat}
Max Tags: ${profile.maxTags}
Preferred Tone: ${profile.preferredTone.join(', ')}

Key Ranking Factors for ${profile.name}:
${profile.rankingFactors.map((f) => `- ${f}`).join('\n')}

Example:
Title: ${profile.examples.title || 'N/A'}
Tags: ${profile.examples.tags.join(', ')}

${signalsContext}

Return ONLY valid JSON with this exact structure:
{
  "title": "string (${profile.titleMaxLength > 0 ? `max ${profile.titleMaxLength} chars` : 'not applicable'})",
  "description": "string (${profile.descriptionMaxLength > 0 ? `max ${profile.descriptionMaxLength} chars` : 'not applicable'})",
  "tags": ["array of ${profile.maxTags} relevant tags in ${profile.tagFormat} format"],
  "caption": "string (max ${profile.captionMaxLength} chars, engaging and platform-appropriate)",
  "keywords": ["array of primary keywords identified"],
  "hashtags": ["array of ${profile.maxTags} platform-optimized hashtags"],
  "metaDescription": "string (SEO-optimized meta description, max 160 chars)",
  "metaKeywords": ["array of 5-10 SEO keywords"],
  "suggestedHashtags": ["array of trending/popular hashtags related to topic"]
}`

  const userPrompt = `Topic: ${topic}
Tone: ${tone}

Generate SEO-optimized content for this topic on ${profile.name}.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const result = JSON.parse(content) as SEOOutput

    console.log('✅ SEO content generated successfully')
    return result

  } catch (error: any) {
    console.error('❌ SEO generation error:', error.message)
    throw new Error(`SEO generation failed: ${error.message}`)
  }
}

/**
 * TODO: Fetch external signals (Google Trends, YouTube Data API, SerpApi)
 *
 * This function can be expanded to fetch real-time data:
 *
 * 1. Google Trends API:
 *    - Get trending keywords for topic
 *    - Compare search interest over time
 *
 * 2. YouTube Data API:
 *    - Search for top videos on topic
 *    - Extract titles, tags, view counts
 *
 * 3. SerpApi:
 *    - Get Google SERP results
 *    - Extract title patterns, meta descriptions
 *
 * If API keys are missing, fall back to LLM-only generation (current approach)
 */
export async function fetchExternalSignals(
  topic: string,
  platform: string
): Promise<GenerateSEOOptions['externalSignals']> {
  // TODO: Implement external API calls
  // For now, return empty signals
  return undefined
}
