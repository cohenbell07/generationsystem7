import { NextRequest, NextResponse } from 'next/server'
import { readFile as fsReadFile } from 'fs/promises'
import path from 'path'

/**
 * Serve uploaded files from the uploads directory
 * Example: GET /uploads/images/example.png
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = params.path.join('/')
    const uploadDir = process.env.UPLOAD_DIR || './uploads'
    const absolutePath = path.join(process.cwd(), uploadDir, filePath)

    // Security: Prevent directory traversal
    const resolvedPath = path.resolve(absolutePath)
    const uploadDirResolved = path.resolve(process.cwd(), uploadDir)

    if (!resolvedPath.startsWith(uploadDirResolved)) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Read the file
    const fileBuffer = await fsReadFile(resolvedPath)

    // Determine content type
    const ext = path.extname(filePath).toLowerCase()
    const contentTypes: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
    }

    const contentType = contentTypes[ext] || 'application/octet-stream'

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })

  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return new NextResponse('File not found', { status: 404 })
    }

    console.error('File serving error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
