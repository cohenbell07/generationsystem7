/**
 * Cross-Platform Video Reformatter
 * Resize and optimize videos for different social platforms using FFmpeg
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import { saveFile } from '../storage'
import { callGPTJSON } from '../ai/llm'

const execAsync = promisify(exec)

// ============================================
// Platform Video Specifications
// ============================================

export interface VideoPlatformSpec {
  platform: string
  name: string
  aspectRatio: string
  width: number
  height: number
  maxDuration: number // seconds
  maxFileSize: number // MB
  fps: number
  format: string
}

export const PLATFORM_SPECS: Record<string, VideoPlatformSpec> = {
  'tiktok': {
    platform: 'tiktok',
    name: 'TikTok',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    maxDuration: 180, // 3 minutes
    maxFileSize: 287, // MB
    fps: 30,
    format: 'mp4',
  },
  'instagram-reel': {
    platform: 'instagram',
    name: 'Instagram Reels',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    maxDuration: 90,
    maxFileSize: 100,
    fps: 30,
    format: 'mp4',
  },
  'instagram-feed': {
    platform: 'instagram',
    name: 'Instagram Feed',
    aspectRatio: '1:1',
    width: 1080,
    height: 1080,
    maxDuration: 60,
    maxFileSize: 100,
    fps: 30,
    format: 'mp4',
  },
  'instagram-story': {
    platform: 'instagram',
    name: 'Instagram Story',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    maxDuration: 15,
    maxFileSize: 100,
    fps: 30,
    format: 'mp4',
  },
  'youtube-short': {
    platform: 'youtube',
    name: 'YouTube Shorts',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    maxDuration: 60,
    maxFileSize: 500,
    fps: 60,
    format: 'mp4',
  },
  'youtube-standard': {
    platform: 'youtube',
    name: 'YouTube Standard',
    aspectRatio: '16:9',
    width: 1920,
    height: 1080,
    maxDuration: 900, // 15 minutes (can be much longer)
    maxFileSize: 2000,
    fps: 60,
    format: 'mp4',
  },
  'facebook-feed': {
    platform: 'facebook',
    name: 'Facebook Feed',
    aspectRatio: '1:1',
    width: 1080,
    height: 1080,
    maxDuration: 240, // 4 minutes
    maxFileSize: 200,
    fps: 30,
    format: 'mp4',
  },
  'facebook-story': {
    platform: 'facebook',
    name: 'Facebook Story',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    maxDuration: 20,
    maxFileSize: 100,
    fps: 30,
    format: 'mp4',
  },
  'linkedin': {
    platform: 'linkedin',
    name: 'LinkedIn',
    aspectRatio: '1:1',
    width: 1080,
    height: 1080,
    maxDuration: 600, // 10 minutes
    maxFileSize: 200,
    fps: 30,
    format: 'mp4',
  },
}

// ============================================
// Video Processing
// ============================================

export interface VideoReformatResult {
  platform: string
  outputPath: string
  fileSize: number
  duration: number
  width: number
  height: number
  format: string
}

/**
 * Reformat video for a specific platform
 * @param inputPath - Path to source video
 * @param platformKey - Target platform key
 * @returns Reformatted video info
 */
export async function reformatVideo(
  inputPath: string,
  platformKey: string
): Promise<VideoReformatResult> {
  const spec = PLATFORM_SPECS[platformKey]
  if (!spec) {
    throw new Error(`Unknown platform: ${platformKey}`)
  }

  const outputFilename = `${path.basename(inputPath, path.extname(inputPath))}_${platformKey}.${spec.format}`
  const outputPath = path.join(path.dirname(inputPath), outputFilename)

  // FFmpeg command to resize and reformat
  const ffmpegCmd = buildFFmpegCommand(inputPath, outputPath, spec)

  console.log(`[VideoReformatter] Processing for ${spec.name}:`, ffmpegCmd)

  try {
    const { stdout, stderr } = await execAsync(ffmpegCmd)
    console.log('[VideoReformatter] FFmpeg output:', stderr)

    // Get output file info
    const { size, duration } = await getVideoInfo(outputPath)

    return {
      platform: spec.name,
      outputPath,
      fileSize: size,
      duration,
      width: spec.width,
      height: spec.height,
      format: spec.format,
    }
  } catch (error: any) {
    console.error('[VideoReformatter] FFmpeg error:', error.message)
    throw new Error(`Video reformatting failed: ${error.message}`)
  }
}

/**
 * Build FFmpeg command for video conversion
 */
function buildFFmpegCommand(
  inputPath: string,
  outputPath: string,
  spec: VideoPlatformSpec
): string {
  // Build video filter for aspect ratio and crop/pad as needed
  const scale = `scale=${spec.width}:${spec.height}:force_original_aspect_ratio=decrease,pad=${spec.width}:${spec.height}:(ow-iw)/2:(oh-ih)/2`

  const filters = [
    scale,
    `fps=${spec.fps}`,
  ].join(',')

  return `ffmpeg -i "${inputPath}" \
    -vf "${filters}" \
    -c:v libx264 \
    -preset medium \
    -crf 23 \
    -c:a aac \
    -b:a 128k \
    -movflags +faststart \
    -t ${spec.maxDuration} \
    "${outputPath}" \
    -y`
}

/**
 * Get video file information
 */
async function getVideoInfo(
  filePath: string
): Promise<{ size: number; duration: number; width: number; height: number }> {
  try {
    // Get file size
    const { stdout: sizeOutput } = await execAsync(`stat -c%s "${filePath}"`)
    const size = parseInt(sizeOutput.trim(), 10)

    // Get video metadata using ffprobe
    const cmd = `ffprobe -v error -show_entries format=duration -show_entries stream=width,height -of json "${filePath}"`
    const { stdout } = await execAsync(cmd)
    const metadata = JSON.parse(stdout)

    const duration = parseFloat(metadata.format?.duration || '0')
    const width = metadata.streams?.[0]?.width || 0
    const height = metadata.streams?.[0]?.height || 0

    return { size: size / (1024 * 1024), duration, width, height } // size in MB
  } catch (error) {
    console.warn('[VideoReformatter] Could not get video info:', error)
    return { size: 0, duration: 0, width: 0, height: 0 }
  }
}

// ============================================
// AI-Optimized Captions & Metadata
// ============================================

export interface PlatformOptimizedContent {
  platform: string
  caption: string
  hashtags: string[]
  title?: string // For YouTube
  description?: string // For YouTube
}

/**
 * Generate platform-optimized captions and metadata
 */
export async function generatePlatformContent(params: {
  originalCaption: string
  platforms: string[]
  topic: string
  targetAudience?: string
}): Promise<PlatformOptimizedContent[]> {
  const { originalCaption, platforms, topic, targetAudience } = params

  const prompt = `You are a social media expert. Optimize this video content for multiple platforms.

Original Caption: "${originalCaption}"
Topic: ${topic}
Target Audience: ${targetAudience || 'general'}

Create optimized versions for: ${platforms.join(', ')}

For each platform, consider:
- Character limits
- Hashtag best practices
- Platform-specific tone
- Optimal hook/CTA

Return JSON array:
[{
  "platform": "tiktok",
  "caption": "optimized caption",
  "hashtags": ["array", "of", "tags"],
  "title": "for youtube only",
  "description": "for youtube only"
}]`

  try {
    return await callGPTJSON<PlatformOptimizedContent[]>(
      prompt,
      'You are a social media optimization expert. Return valid JSON only.'
    )
  } catch (error) {
    console.error('[VideoReformatter] Content generation failed:', error)

    // Fallback: return basic versions
    return platforms.map((platform) => ({
      platform,
      caption: originalCaption,
      hashtags: ['viral', 'trending', topic.toLowerCase().replace(/\s+/g, '')],
    }))
  }
}

// ============================================
// Batch Processing
// ============================================

/**
 * Reformat single video for multiple platforms
 */
export async function reformatForAllPlatforms(
  inputPath: string,
  targetPlatforms: string[]
): Promise<VideoReformatResult[]> {
  const results: VideoReformatResult[] = []

  for (const platformKey of targetPlatforms) {
    try {
      const result = await reformatVideo(inputPath, platformKey)
      results.push(result)
    } catch (error: any) {
      console.error(`[VideoReformatter] Failed for ${platformKey}:`, error.message)
      // Continue with other platforms even if one fails
    }
  }

  return results
}

/**
 * Get all available platform formats
 */
export function getAllPlatformSpecs(): VideoPlatformSpec[] {
  return Object.values(PLATFORM_SPECS)
}

/**
 * Get spec by key
 */
export function getPlatformSpec(key: string): VideoPlatformSpec | undefined {
  return PLATFORM_SPECS[key]
}
