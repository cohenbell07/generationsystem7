import OpenAI from 'openai'

/**
 * DALL·E Image Generation
 *
 * TODO: Add your OpenAI API key to .env
 * OPENAI_API_KEY=sk-...
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export interface DalleGenerateOptions {
  prompt: string
  width: number
  height: number
  n?: number // Number of variations (default 1)
}

export interface GeneratedImage {
  url: string
  revisedPrompt?: string
}

/**
 * Generate images with DALL·E 3
 *
 * IMPORTANT: This function uses the user's exact prompt without modification.
 * No hidden prompt rewriting is performed.
 */
export async function generateWithDalle(
  options: DalleGenerateOptions
): Promise<GeneratedImage[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      'OPENAI_API_KEY is not set. Please add it to your .env file.'
    )
  }

  const { prompt, width, height, n = 1 } = options

  // DALL·E 3 only supports specific sizes
  let size: '1024x1024' | '1792x1024' | '1024x1792' = '1024x1024'

  if (width > height) {
    size = '1792x1024'
  } else if (height > width) {
    size = '1024x1792'
  }

  try {
    console.log(`🎨 Generating ${n} image(s) with DALL·E 3...`)
    console.log(`   Prompt: "${prompt}"`)
    console.log(`   Size: ${size}`)

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt, // User's exact prompt - NO REWRITING
      n: 1, // DALL·E 3 only supports n=1
      size,
      quality: 'standard',
      response_format: 'url',
    })

    const results: GeneratedImage[] = []

    if (response.data) {
      for (const image of response.data) {
        if (image.url) {
          results.push({
            url: image.url,
            revisedPrompt: image.revised_prompt,
          })
        }
      }
    }

    console.log(`✅ Generated ${results.length} image(s)`)
    return results

  } catch (error: any) {
    console.error('❌ DALL·E generation error:', error.message)
    throw new Error(`DALL·E generation failed: ${error.message}`)
  }
}

/**
 * Estimate cost per image generation
 * DALL·E 3: ~$0.04 per standard 1024x1024 image
 */
export function estimateDalleCost(size: string): number {
  if (size.includes('1792') || size.includes('1024x1792')) {
    return 0.08 // HD or larger size
  }
  return 0.04 // Standard 1024x1024
}
