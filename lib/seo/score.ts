import { getPlatformProfile } from './platformProfiles'
import type { SEOOutput } from './generate'

/**
 * SEO Scoring System
 *
 * Provides deterministic scoring based on:
 * - Keyword presence and placement
 * - Length constraints
 * - Readability
 * - Platform-specific heuristics
 * - Tag diversity
 */

export interface ScoreResult {
  score: number // 0-100
  reasons: string[]
  improvements: string[]
  breakdown: {
    keywordScore: number
    lengthScore: number
    tagScore: number
    readabilityScore: number
    platformScore: number
  }
}

/**
 * Calculate SEO score for generated content
 */
export function calculateSEOScore(
  content: SEOOutput,
  platform: string,
  topic: string
): ScoreResult {
  const profile = getPlatformProfile(platform)
  if (!profile) {
    throw new Error(`Unknown platform: ${platform}`)
  }

  const reasons: string[] = []
  const improvements: string[] = []

  // 1. Keyword Score (30 points)
  const keywordScore = scoreKeywords(content, topic, reasons, improvements)

  // 2. Length Score (20 points)
  const lengthScore = scoreLength(content, profile, reasons, improvements)

  // 3. Tag Score (20 points)
  const tagScore = scoreTags(content, profile, reasons, improvements)

  // 4. Readability Score (15 points)
  const readabilityScore = scoreReadability(content, reasons, improvements)

  // 5. Platform-specific Score (15 points)
  const platformScore = scorePlatformSpecific(content, profile, reasons, improvements)

  const totalScore = Math.round(
    keywordScore + lengthScore + tagScore + readabilityScore + platformScore
  )

  return {
    score: Math.min(100, totalScore),
    reasons,
    improvements,
    breakdown: {
      keywordScore,
      lengthScore,
      tagScore,
      readabilityScore,
      platformScore,
    },
  }
}

/**
 * Score keyword usage (30 points max)
 */
function scoreKeywords(
  content: SEOOutput,
  topic: string,
  reasons: string[],
  improvements: string[]
): number {
  let score = 0
  const topicKeywords = topic.toLowerCase().split(' ').filter((w) => w.length > 3)

  // Check title for keywords (15 points)
  const titleLower = content.title.toLowerCase()
  const titleKeywordCount = topicKeywords.filter((kw) => titleLower.includes(kw)).length

  if (titleKeywordCount >= topicKeywords.length) {
    score += 15
    reasons.push('All primary keywords present in title')
  } else if (titleKeywordCount > 0) {
    score += 10
    reasons.push(`${titleKeywordCount}/${topicKeywords.length} keywords in title`)
    improvements.push(`Include missing keywords: ${topicKeywords.filter((kw) => !titleLower.includes(kw)).join(', ')}`)
  } else {
    improvements.push('Add primary keywords to title')
  }

  // Check keyword position in title (5 points)
  const firstKeyword = topicKeywords.find((kw) => titleLower.includes(kw))
  if (firstKeyword) {
    const position = titleLower.indexOf(firstKeyword)
    if (position < 20) {
      score += 5
      reasons.push('Primary keyword appears early in title')
    } else {
      score += 2
      improvements.push('Move primary keyword earlier in title')
    }
  }

  // Check caption/description for keywords (10 points)
  const captionLower = content.caption.toLowerCase()
  const captionKeywordCount = topicKeywords.filter((kw) => captionLower.includes(kw)).length

  if (captionKeywordCount > 0) {
    score += Math.min(10, captionKeywordCount * 3)
    reasons.push('Keywords present in caption')
  } else {
    improvements.push('Include keywords naturally in caption')
  }

  return score
}

/**
 * Score content length (20 points max)
 */
function scoreLength(
  content: SEOOutput,
  profile: any,
  reasons: string[],
  improvements: string[]
): number {
  let score = 0

  // Title length (10 points)
  if (profile.titleMaxLength > 0) {
    const titleLength = content.title.length
    if (titleLength > 0 && titleLength <= profile.titleMaxLength) {
      score += 10
      reasons.push('Title length is optimal')
    } else if (titleLength > profile.titleMaxLength) {
      score += 5
      improvements.push(`Shorten title to ${profile.titleMaxLength} characters`)
    } else {
      improvements.push('Add a descriptive title')
    }
  } else {
    score += 10 // No title required
  }

  // Caption length (10 points)
  const captionLength = content.caption.length
  if (captionLength > 20 && captionLength <= profile.captionMaxLength) {
    score += 10
    reasons.push('Caption length is appropriate')
  } else if (captionLength > profile.captionMaxLength) {
    score += 5
    improvements.push(`Shorten caption to ${profile.captionMaxLength} characters`)
  } else if (captionLength <= 20) {
    improvements.push('Expand caption with more detail')
  }

  return score
}

/**
 * Score tags/hashtags (20 points max)
 */
function scoreTags(
  content: SEOOutput,
  profile: any,
  reasons: string[],
  improvements: string[]
): number {
  let score = 0

  const tagCount = content.tags.length

  // Tag count (10 points)
  if (tagCount > 0 && tagCount <= profile.maxTags) {
    score += 10
    reasons.push(`Good tag count (${tagCount}/${profile.maxTags})`)
  } else if (tagCount > profile.maxTags) {
    score += 5
    improvements.push(`Reduce to ${profile.maxTags} tags`)
  } else {
    improvements.push('Add relevant tags')
  }

  // Tag diversity (5 points)
  const uniqueTags = new Set(content.tags.map((t) => t.toLowerCase()))
  if (uniqueTags.size === tagCount) {
    score += 5
    reasons.push('All tags are unique')
  } else {
    improvements.push('Remove duplicate tags')
  }

  // Tag format (5 points)
  const correctFormat = content.tags.every((tag) => {
    if (profile.tagFormat === 'hashtag') {
      return tag.startsWith('#')
    }
    return !tag.startsWith('#')
  })

  if (correctFormat) {
    score += 5
    reasons.push('Tags follow platform format')
  } else {
    improvements.push(`Use ${profile.tagFormat} format for tags`)
  }

  return score
}

/**
 * Score readability (15 points max)
 */
function scoreReadability(
  content: SEOOutput,
  reasons: string[],
  improvements: string[]
): number {
  let score = 0

  const title = content.title
  const caption = content.caption

  // Check for clear value proposition in title (7 points)
  const hasNumbers = /\d+/.test(title)
  const hasPowerWords = /\b(best|top|ultimate|complete|essential|proven|secret)\b/i.test(title)

  if (hasNumbers) {
    score += 4
    reasons.push('Title includes specific numbers')
  } else {
    improvements.push('Consider adding numbers for clarity (e.g., "5 Tips", "10 Ways")')
  }

  if (hasPowerWords) {
    score += 3
    reasons.push('Title uses engaging power words')
  }

  // Check caption readability (8 points)
  const sentences = caption.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const avgSentenceLength = caption.length / Math.max(sentences.length, 1)

  if (avgSentenceLength < 150) {
    score += 5
    reasons.push('Caption has good readability')
  } else {
    improvements.push('Break caption into shorter sentences')
  }

  // Check for call-to-action (3 points)
  const hasCTA = /\b(click|watch|learn|discover|try|get|find|see|swipe|comment|share)\b/i.test(
    caption
  )
  if (hasCTA) {
    score += 3
    reasons.push('Caption includes a call-to-action')
  } else {
    improvements.push('Add a call-to-action to drive engagement')
  }

  return score
}

/**
 * Score platform-specific best practices (15 points max)
 */
function scorePlatformSpecific(
  content: SEOOutput,
  profile: any,
  reasons: string[],
  improvements: string[]
): number {
  let score = 10 // Base score for generating content

  // Platform-specific checks
  const caption = content.caption

  if (profile.id === 'instagram' || profile.id === 'tiktok') {
    // Check for emoji usage
    const hasEmoji = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]/u.test(
      caption
    )
    if (hasEmoji) {
      score += 3
      reasons.push('Caption includes engaging emojis')
    } else {
      improvements.push('Consider adding 1-2 relevant emojis')
    }
  }

  if (profile.id === 'linkedin') {
    // Professional tone check (avoid excessive emojis)
    const emojiCount = (caption.match(/[\u{1F600}-\u{1F6FF}]/gu) || []).length
    if (emojiCount <= 2) {
      score += 2
      reasons.push('Maintains professional tone')
    } else {
      improvements.push('Reduce emoji count for professional audience')
    }
  }

  return score
}
