/**
 * Publisher adapter types and interfaces
 */

export interface PostDraft {
  id: string
  platform: string
  caption: string
  tags?: string
  assetId?: string
  asset?: {
    url: string
    filename: string
  }
}

export interface PublishResult {
  success: boolean
  platformPostId?: string
  error?: string
  publishedUrl?: string
}

export interface Publisher {
  platform: string
  publish(post: PostDraft, accessToken: string): Promise<PublishResult>
  validateConnection(accessToken: string): Promise<boolean>
}
