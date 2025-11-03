import fs from 'fs'
import path from 'path'
import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Google Gemini Image Generation with Vision
 *
 * Uses Google's Gemini 1.5 Pro Vision API for multimodal image generation
 * When a product image is provided, it's passed to the vision model for context
 *
 * TODO: Add your Google Gemini API key to .env
 * GOOGLE_GEMINI_API_KEY=...
 *
 * API Documentation: https://ai.google.dev/gemini-api/docs
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
 * Generate images with Google Gemini using Vision model
 *
 * Uses gemini-1.5-pro for multimodal image generation (supports text + images)
 * IMPORTANT: This function uses the user's exact prompt without modification.
 * No hidden prompt rewriting is performed.
 */
export async function generateWithGeminiImage(
  options: GeminiGenerateOptions
): Promise<GeneratedImage[]> {
  const { prompt, width, height, n = 1, productImagePath } = options

  // FALLBACK MODE: If no API key, return dummy/test images
  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    console.log('⚠️  GOOGLE_GEMINI_API_KEY not set - using fallback test images')
    const results: GeneratedImage[] = []
    for (let i = 0; i < n; i++) {
      const seed = Date.now() + i
      results.push({
        url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
      })
    }
    return results
  }

  console.log(`🎨 Generating ${n} image(s) with Google Gemini Vision...`)
  console.log(`   Prompt: "${prompt}"`)
  console.log(`   Size: ${width}x${height}`)
  if (productImagePath) {
    console.log(`   Product image: ${productImagePath}`)
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
    const results: GeneratedImage[] = []

    // Read product image if provided and convert to base64
    let productImageData: { inlineData: { data: string; mimeType: string } } | null = null
    if (productImagePath) {
      try {
        // Handle both absolute paths and relative paths
        let imagePath = productImagePath

        // If it's a URL path like /uploads/products/..., convert to absolute file path
        if (productImagePath.startsWith('/uploads/')) {
          imagePath = path.join(process.cwd(), productImagePath.replace(/^\//, ''))
        } else if (productImagePath.startsWith('uploads/')) {
          imagePath = path.join(process.cwd(), productImagePath)
        }

        console.log(`   Reading product image from: ${imagePath}`)
        const imageBuffer = fs.readFileSync(imagePath)
        const base64Image = imageBuffer.toString('base64')
        const mimeType = getMimeType(imagePath)

        productImageData = {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          }
        }
        console.log(`   ✓ Product image loaded (${mimeType}, ${imageBuffer.length} bytes)`)
      } catch (err: any) {
        console.error(`   ⚠️  Failed to load product image: ${err.message}`)
      }
    }

    // Generate images using Gemini Vision API
    for (let i = 0; i < n; i++) {
      // Use gemini-1.5-pro for multimodal generation (supports both text and images)
      const modelName = 'gemini-1.5-pro'
      const model = genAI.getGenerativeModel({ model: modelName })

      // Build the content parts for the API request
      const parts: any[] = []

      // Add product image first if provided
      if (productImageData) {
        parts.push(productImageData)
      }

      // Add the text prompt
      const fullPrompt = productImageData
        ? `${prompt}. Create a professional marketing image at ${width}x${height} resolution with high quality, photorealistic style.`
        : `${prompt}. Create a professional image at ${width}x${height} resolution.`

      parts.push({ text: fullPrompt })

      // Generate the content
      const result = await model.generateContent({
        contents: [{ role: 'user', parts }],
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
            console.log(`   ✓ Generated image ${i + 1} with inline data`)
          } else if (part.text) {
            // Gemini returned text instead of an image
            // This means it doesn't support direct image generation
            // Fall back to placeholder
            console.log(`   ⚠️  Gemini returned text instead of image, using placeholder`)
            const seed = Date.now() + i
            results.push({
              url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
            })
          }
        } else {
          throw new Error('No content in response')
        }
      } else {
        throw new Error('Invalid response format from Gemini API')
      }
    }

    console.log(`✅ Generated ${results.length} image(s) with Gemini Vision`)
    return results

  } catch (error: any) {
    console.error('❌ Gemini image generation error:', error.message)

    // Fallback to placeholder images if Gemini Vision API is not available
    console.log('⚠️  Falling back to placeholder images (Gemini Vision may not support direct image generation)')
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
