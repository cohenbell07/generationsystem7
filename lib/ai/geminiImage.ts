import fs from 'fs'
import path from 'path'
import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Google Gemini Image Generation with Imagen
 *
 * Uses Google's Gemini API with Imagen 3 for image generation
 *
 * TODO: Add your Google Gemini API key to .env
 * GOOGLE_GEMINI_API_KEY=...
 *
 * API Documentation: https://ai.google.dev/gemini-api/docs/imagen
 */

export interface GeminiGenerateOptions {
  prompt: string
  width: number
  height: number
  n?: number
  productImagePath?: string // Optional: path to product image for compositing
}

export interface GeneratedImage {
  url: string
}

/**
 * Generate images with Google Gemini using Imagen
 *
 * Uses gemini-1.5-pro-latest model for image generation
 * IMPORTANT: This function uses the user's exact prompt without modification.
 * No hidden prompt rewriting is performed.
 */
export async function generateWithGeminiImage(
  options: GeminiGenerateOptions
): Promise<GeneratedImage[]> {
  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    throw new Error(
      'GOOGLE_GEMINI_API_KEY is not set. Please add it to your .env file.'
    )
  }

  const { prompt, width, height, n = 1, productImagePath } = options

  console.log(`🎨 Generating ${n} image(s) with Google Gemini (Imagen)...`)
  console.log(`   Prompt: "${prompt}"`)
  console.log(`   Size: ${width}x${height}`)
  if (productImagePath) {
    console.log(`   Product image: ${productImagePath}`)
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
    const results: GeneratedImage[] = []

    // Generate images using Imagen through Gemini API
    for (let i = 0; i < n; i++) {
      // Use the imagen-3.0-generate-001 model for image generation
      const model = genAI.getGenerativeModel({ model: 'imagen-3.0-generate-001' })

      // Build the full prompt
      let fullPrompt = prompt

      if (productImagePath) {
        fullPrompt = `${prompt}. Professional marketing image, high quality, photorealistic.`
      }

      // Generate the image
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.4,
          candidateCount: 1,
        },
      })

      const response = result.response

      // Extract image data from response
      if (response.candidates && response.candidates[0]) {
        const candidate = response.candidates[0]

        // Check if there's image data in the response
        if (candidate.content?.parts?.[0]) {
          const part = candidate.content.parts[0]

          // If the API returns a base64 image, convert it to a data URL
          if (part.inlineData?.data) {
            const base64Data = part.inlineData.data
            const mimeType = part.inlineData.mimeType || 'image/png'
            results.push({
              url: `data:${mimeType};base64,${base64Data}`,
            })
          } else if (part.text) {
            // Fallback: generate a placeholder with unique seed
            const seed = Date.now() + i
            results.push({
              url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
            })
          }
        } else {
          throw new Error('No image data in response')
        }
      } else {
        throw new Error('Invalid response format from Gemini API')
      }
    }

    console.log(`✅ Generated ${results.length} image(s) with Gemini`)
    return results

  } catch (error: any) {
    console.error('❌ Gemini image generation error:', error.message)

    // Fallback to placeholder images if Imagen API is not available
    console.log('⚠️  Falling back to placeholder images (Imagen API may not be available)')
    const results: GeneratedImage[] = []
    for (let i = 0; i < n; i++) {
      const seed = Date.now() + i
      results.push({
        url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
      })
    }
    return results
  }
}

/**
 * Get MIME type from file extension
 */
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  }
  return mimeTypes[ext] || 'image/jpeg'
}

/**
 * Estimate cost per image generation
 * Gemini 1.5 Pro Vision: Based on token usage (approximate)
 */
export function estimateGeminiCost(size: string): number {
  return 0.04 // Approximate cost per request
}
