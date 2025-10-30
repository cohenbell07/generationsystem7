import { NextRequest, NextResponse } from 'next/server'
import { generateWithDalle, estimateDalleCost } from '@/lib/ai/dalle'
import { generateWithGeminiImage, estimateGeminiCost } from '@/lib/ai/geminiImage'
import { generateWithRunway, estimateRunwayCost } from '@/lib/ai/runway'
import { compositeProductImage } from '@/lib/ai/composite'
import { downloadAndSave, saveFile } from '@/lib/storage'
import { prisma } from '@/lib/db'
import { generateFilename } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      model, // "dalle", "gemini", or "runway"
      prompt,
      width,
      height,
      platform,
      userId, // Optional: only provided when user is authenticated
      productImage, // Optional: base64 data URL or existing file path
      preserveProduct = false,
      placement = 'center',
      scale = 0.8,
      rotation = 0,
      variations = 2,
    } = body

    if (!model || !prompt || !width || !height) {
      return NextResponse.json(
        { error: 'Missing required fields: model, prompt, width, height' },
        { status: 400 }
      )
    }

    console.log(`\n🎨 Image generation request:`)
    console.log(`   Model: ${model}`)
    console.log(`   Prompt: "${prompt}"`)
    console.log(`   Size: ${width}x${height}`)
    console.log(`   Platform: ${platform || 'custom'}`)
    console.log(`   Product compositing: ${preserveProduct ? 'Yes' : 'No'}`)

    // Step 1: Generate image(s) using selected model
    let generatedImages: Array<{ url: string }>

    if (model === 'dalle') {
      generatedImages = await generateWithDalle({
        prompt,
        width,
        height,
        n: 1, // DALL·E 3 only supports 1
      })
    } else if (model === 'gemini') {
      generatedImages = await generateWithGeminiImage({
        prompt,
        width,
        height,
        n: Math.min(variations, 2),
        productImagePath: preserveProduct && productImage ? productImage : undefined,
      })
    } else if (model === 'runway') {
      generatedImages = await generateWithRunway({
        prompt,
        width,
        height,
        n: Math.min(variations, 2),
      })
    } else {
      return NextResponse.json({ error: 'Invalid model. Use "dalle", "gemini", or "runway"' }, { status: 400 })
    }

    // Step 2: Download and save generated images
    const assets = []
    let costPerImage: number
    if (model === 'dalle') {
      costPerImage = estimateDalleCost(`${width}x${height}`)
    } else if (model === 'gemini') {
      costPerImage = estimateGeminiCost(`${width}x${height}`)
    } else {
      costPerImage = estimateRunwayCost(`${width}x${height}`)
    }

    for (let i = 0; i < generatedImages.length; i++) {
      const genImage = generatedImages[i]
      let finalImagePath: string

      // If product compositing is requested
      if (preserveProduct && productImage) {
        console.log(`   Compositing product into generated image ${i + 1}...`)

        // Save generated background
        const bgFilename = generateFilename('bg.png', 'generated')
        const bgPath = await downloadAndSave(genImage.url, bgFilename, 'backgrounds')

        // Composite product over background
        const compositedBuffer = await compositeProductImage({
          backgroundPath: bgPath,
          productPath: productImage, // Assuming it's already saved
          placement,
          scale,
          rotation,
          outputWidth: width,
          outputHeight: height,
        })

        // Save composited image
        const filename = generateFilename('composited.png', model)
        finalImagePath = await saveFile(compositedBuffer, filename, 'images')
      } else {
        // No compositing - just save the generated image
        const filename = generateFilename('generated.png', model)
        finalImagePath = await downloadAndSave(genImage.url, filename, 'images')
      }

      // Save to database
      const asset = await prisma.asset.create({
        data: {
          userId: userId || null, // Allow null for unauthenticated users
          url: finalImagePath,
          filename: finalImagePath.split('/').pop() || '',
          model,
          prompt,
          width,
          height,
          platform: platform || null,
          hasProduct: preserveProduct && !!productImage,
          productUrl: productImage || null,
          placement: preserveProduct ? placement : null,
          scale: preserveProduct ? scale : null,
          rotation: preserveProduct ? rotation : null,
          costEstimate: costPerImage,
        },
      })

      assets.push(asset)
    }

    console.log(`✅ Generated ${assets.length} image(s) successfully`)

    return NextResponse.json({
      success: true,
      assets,
      totalCost: assets.length * costPerImage,
    })

  } catch (error: any) {
    console.error('❌ Image generation error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Image generation failed' },
      { status: 500 }
    )
  }
}
