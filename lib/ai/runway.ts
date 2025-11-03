/**
 * Runway ML Gen-2 Image Generation
 *
 * TODO: Add your Runway API key to .env
 * RUNWAY_API_KEY=...
 *
 * API Documentation: https://docs.runwayml.com/reference/gen2
 */

export interface RunwayGenerateOptions {
  prompt: string
  width: number
  height: number
  n?: number // Number of variations (default 1)
  productImagePath?: string // Optional: photo input for image-to-image
}

export interface GeneratedImage {
  url: string
}

/**
 * Generate images with Runway ML Gen-2
 *
 * IMPORTANT: This function uses the user's exact prompt without modification.
 * No hidden prompt rewriting is performed.
 */
export async function generateWithRunway(
  options: RunwayGenerateOptions
): Promise<GeneratedImage[]> {
  if (!process.env.RUNWAY_API_KEY) {
    throw new Error(
      'RUNWAY_API_KEY is not set. Please add it to your .env file.'
    )
  }

  const { prompt, width, height, n = 1 } = options

  console.log(`🎨 Generating ${n} image(s) with Runway ML Gen-2...`)
  console.log(`   Prompt: "${prompt}"`)
  console.log(`   Size: ${width}x${height}`)

  try {
    const results: GeneratedImage[] = []

    // Generate images (one at a time for Gen-2)
    for (let i = 0; i < n; i++) {
      // Create generation task
      const taskResponse = await fetch('https://api.runwayml.com/v1/gen2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Runway-Version': '2024-09-13',
        },
        body: JSON.stringify({
          promptText: prompt,
          width,
          height,
          // Gen-2 specific parameters
          model: 'gen2',
          numInferenceSteps: 30,
          guidanceScale: 7.5,
          seed: Math.floor(Math.random() * 1000000),
        }),
      })

      if (!taskResponse.ok) {
        const errorText = await taskResponse.text()
        throw new Error(`Runway API error: ${taskResponse.status} ${errorText}`)
      }

      const taskData = await taskResponse.json()
      const taskId = taskData.id

      console.log(`   Task ${i + 1}/${n} created: ${taskId}`)

      // Poll for completion
      let imageUrl: string | null = null
      let attempts = 0
      const maxAttempts = 60 // 60 attempts x 2 seconds = 2 minutes max wait

      while (!imageUrl && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait 2 seconds
        attempts++

        const statusResponse = await fetch(
          `https://api.runwayml.com/v1/tasks/${taskId}`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
              'X-Runway-Version': '2024-09-13',
            },
          }
        )

        if (!statusResponse.ok) {
          throw new Error(`Failed to check task status: ${statusResponse.status}`)
        }

        const statusData = await statusResponse.json()

        if (statusData.status === 'SUCCEEDED' && statusData.output) {
          imageUrl = Array.isArray(statusData.output)
            ? statusData.output[0]
            : statusData.output
          console.log(`   ✅ Task ${i + 1}/${n} completed`)
        } else if (statusData.status === 'FAILED') {
          throw new Error(`Task failed: ${statusData.error || 'Unknown error'}`)
        } else {
          console.log(`   ⏳ Task ${i + 1}/${n} status: ${statusData.status} (attempt ${attempts}/${maxAttempts})`)
        }
      }

      if (!imageUrl) {
        throw new Error(`Task timed out after ${maxAttempts} attempts`)
      }

      results.push({ url: imageUrl })
    }

    console.log(`✅ Generated ${results.length} image(s) with Runway`)
    return results

  } catch (error: any) {
    console.error('❌ Runway generation error:', error.message)
    throw new Error(`Runway generation failed: ${error.message}`)
  }
}

/**
 * Estimate cost per image generation
 * Runway Gen-2: Approximate pricing based on generation time
 * ~$0.05 per second of generation (typical 4-second generation = ~$0.20)
 */
export function estimateRunwayCost(size: string): number {
  // Estimate based on typical generation time
  // Larger images may take longer, but this is a rough estimate
  return 0.20 // Average cost per image
}
