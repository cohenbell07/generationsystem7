import fs from 'fs/promises'
import path from 'path'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import { Readable } from 'stream'

/**
 * Storage service abstraction
 *
 * Currently uses local filesystem storage.
 * TODO: Replace with S3/R2/Cloud Storage for production.
 */

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads'

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
  } catch (error) {
    // Directory might already exist
  }
}

/**
 * Save a file to local storage
 */
export async function saveFile(
  buffer: Buffer,
  filename: string,
  subdirectory?: string
): Promise<string> {
  await ensureUploadDir()

  const dir = subdirectory ? path.join(UPLOAD_DIR, subdirectory) : UPLOAD_DIR
  await fs.mkdir(dir, { recursive: true })

  const filepath = path.join(dir, filename)
  await fs.writeFile(filepath, buffer)

  // Return relative path for storage
  const relativePath = subdirectory ? `${subdirectory}/${filename}` : filename
  return `/uploads/${relativePath}`
}

/**
 * Download a file from URL and save to local storage
 * Supports both HTTP URLs and data URLs (data:image/png;base64,...)
 */
export async function downloadAndSave(
  url: string,
  filename: string,
  subdirectory?: string
): Promise<string> {
  await ensureUploadDir()

  const dir = subdirectory ? path.join(UPLOAD_DIR, subdirectory) : UPLOAD_DIR
  await fs.mkdir(dir, { recursive: true })

  const filepath = path.join(dir, filename)

  // Handle data URLs (e.g., data:image/png;base64,...)
  if (url.startsWith('data:')) {
    const matches = url.match(/^data:([^;]+);base64,(.+)$/)
    if (!matches) {
      throw new Error('Invalid data URL format')
    }

    const base64Data = matches[2]
    const buffer = Buffer.from(base64Data, 'base64')
    await fs.writeFile(filepath, buffer)

    const relativePath = subdirectory ? `${subdirectory}/${filename}` : filename
    return `/uploads/${relativePath}`
  }

  // Handle regular HTTP/HTTPS URLs
  const response = await fetch(url)
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download file: ${response.statusText}`)
  }

  // Convert web stream to Node stream
  const nodeStream = Readable.fromWeb(response.body as any)
  const fileStream = createWriteStream(filepath)

  await pipeline(nodeStream, fileStream)

  const relativePath = subdirectory ? `${subdirectory}/${filename}` : filename
  return `/uploads/${relativePath}`
}

/**
 * Read a file from storage
 */
export async function readFile(relativePath: string): Promise<Buffer> {
  // Remove leading /uploads/ if present
  const cleanPath = relativePath.replace(/^\/uploads\//, '')
  const filepath = path.join(UPLOAD_DIR, cleanPath)
  return await fs.readFile(filepath)
}

/**
 * Delete a file from storage
 */
export async function deleteFile(relativePath: string): Promise<void> {
  const cleanPath = relativePath.replace(/^\/uploads\//, '')
  const filepath = path.join(UPLOAD_DIR, cleanPath)
  await fs.unlink(filepath)
}

/**
 * Get absolute filesystem path
 */
export function getAbsolutePath(relativePath: string): string {
  const cleanPath = relativePath.replace(/^\/uploads\//, '')
  return path.join(process.cwd(), UPLOAD_DIR, cleanPath)
}

/**
 * TODO: S3/Cloud Storage integration
 *
 * To switch to S3, replace the functions above with:
 *
 * 1. Install AWS SDK:
 *    npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
 *
 * 2. Configure credentials in .env:
 *    AWS_ACCESS_KEY_ID=...
 *    AWS_SECRET_ACCESS_KEY=...
 *    AWS_REGION=us-east-1
 *    S3_BUCKET=your-bucket-name
 *
 * 3. Replace saveFile/downloadAndSave with S3 PutObject
 * 4. Replace readFile with S3 GetObject
 * 5. Replace deleteFile with S3 DeleteObject
 * 6. Use presigned URLs for public access
 *
 * Example:
 *
 *   import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
 *
 *   const s3 = new S3Client({ region: process.env.AWS_REGION })
 *
 *   await s3.send(new PutObjectCommand({
 *     Bucket: process.env.S3_BUCKET,
 *     Key: filename,
 *     Body: buffer,
 *   }))
 */
