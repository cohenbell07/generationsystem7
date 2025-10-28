import sharp from 'sharp'
import { getAbsolutePath } from '../storage'

/**
 * Image Compositing Utilities
 *
 * Handles product image compositing over generated backgrounds.
 */

export interface CompositeOptions {
  backgroundPath: string // Generated background image
  productPath: string // Product image to overlay
  placement: 'center' | 'left' | 'right'
  scale: number // 0.1 to 1.0
  rotation: number // degrees
  outputWidth: number
  outputHeight: number
}

/**
 * Composite a product image over a background
 *
 * This preserves the product image without distortion and places it
 * according to user preferences.
 */
export async function compositeProductImage(
  options: CompositeOptions
): Promise<Buffer> {
  const {
    backgroundPath,
    productPath,
    placement,
    scale,
    rotation,
    outputWidth,
    outputHeight,
  } = options

  try {
    // Load background
    const background = sharp(getAbsolutePath(backgroundPath))
    const bgMetadata = await background.metadata()

    // Resize background to target dimensions
    const resizedBackground = background.resize(outputWidth, outputHeight, {
      fit: 'cover',
      position: 'center',
    })

    // Load and process product image
    let product = sharp(getAbsolutePath(productPath))
    const productMetadata = await product.metadata()

    // Calculate product dimensions based on scale
    const targetProductWidth = Math.round(outputWidth * scale)
    const targetProductHeight = Math.round(
      (targetProductWidth * (productMetadata.height || 1)) /
        (productMetadata.width || 1)
    )

    // Resize product maintaining aspect ratio
    product = product.resize(targetProductWidth, targetProductHeight, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })

    // Rotate if specified
    if (rotation !== 0) {
      product = product.rotate(rotation, {
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
    }

    // Calculate position based on placement
    let left = 0
    const top = Math.round((outputHeight - targetProductHeight) / 2)

    switch (placement) {
      case 'left':
        left = Math.round(outputWidth * 0.15)
        break
      case 'right':
        left = Math.round(outputWidth * 0.85 - targetProductWidth)
        break
      case 'center':
      default:
        left = Math.round((outputWidth - targetProductWidth) / 2)
        break
    }

    // Composite product over background
    const result = await resizedBackground
      .composite([
        {
          input: await product.toBuffer(),
          top,
          left,
        },
      ])
      .png()
      .toBuffer()

    return result
  } catch (error: any) {
    console.error('❌ Compositing error:', error.message)
    throw new Error(`Image compositing failed: ${error.message}`)
  }
}

/**
 * Simple background removal (stub)
 *
 * TODO: Integrate a proper background removal service:
 * - remove.bg API (https://remove.bg)
 * - U²-Net model
 * - ClipDrop API
 * - Local ML model (RMBG-1.4, etc.)
 *
 * For now, this assumes the product image already has a transparent background.
 */
export async function removeBackground(imagePath: string): Promise<Buffer> {
  console.log('⚠️  Background removal is a stub. Product image should have transparent background.')
  console.log('   TODO: Integrate remove.bg or U²-Net for automatic background removal')

  // For now, just return the original image
  // In production, call a background removal API/model here
  const image = sharp(getAbsolutePath(imagePath))
  return await image.png().toBuffer()
}

/**
 * Resize an image to different platform presets
 */
export async function resizeToPreset(
  imagePath: string,
  targetWidth: number,
  targetHeight: number
): Promise<Buffer> {
  const image = sharp(getAbsolutePath(imagePath))

  return await image
    .resize(targetWidth, targetHeight, {
      fit: 'cover',
      position: 'center',
    })
    .png()
    .toBuffer()
}

/**
 * TODO: Background removal integration guide
 *
 * Option 1: remove.bg API (easiest)
 * ================================
 * 1. Sign up at https://remove.bg and get API key
 * 2. Add to .env: REMOVEBG_API_KEY=...
 * 3. Install: npm install remove.bg
 * 4. Replace removeBackground() with:
 *
 *    import removeBackgroundAPI from 'remove.bg'
 *
 *    const result = await removeBackgroundAPI({
 *      path: imagePath,
 *      apiKey: process.env.REMOVEBG_API_KEY,
 *      size: 'auto',
 *      outputFile: outputPath,
 *    })
 *
 * Option 2: Local U²-Net model
 * ============================
 * 1. Install: npm install @imgly/background-removal-node
 * 2. Replace removeBackground() with:
 *
 *    import removeBackground from '@imgly/background-removal-node'
 *
 *    const blob = await removeBackground(imagePath)
 *    const buffer = Buffer.from(await blob.arrayBuffer())
 *
 * Option 3: ClipDrop API
 * ======================
 * Similar to remove.bg, use their API endpoint
 */
