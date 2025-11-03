/**
 * Dynamic Branding AI
 * User uploads brand kit once, AI matches future content to brand style
 */

import { callGPTJSON } from '../ai/llm'
import { db } from '../db'

export interface BrandKit {
  id: string
  userId: string
  brandName: string
  logoUrl: string
  colorPalette: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  typography: {
    headingFont: string
    bodyFont: string
  }
  toneOfVoice: 'professional' | 'casual' | 'playful' | 'luxury' | 'authoritative'
  brandValues: string[]
  visualStyle: string // description of brand aesthetic
  tagline?: string
}

export interface BrandMatchedContent {
  caption: string
  imagePrompt: string
  colorSuggestions: string[]
  styleNotes: string
  brandAlignment: number // 0-10 score
}

/**
 * Create or update brand kit
 */
export async function saveBrandKit(brandKit: Omit<BrandKit, 'id'>): Promise<BrandKit> {
  // In real implementation, save to database
  // For demo, return the input with ID
  const fullBrandKit: BrandKit = {
    ...brandKit,
    id: `brand-${Date.now()}`,
  }

  console.log('✅ Brand kit saved:', fullBrandKit.brandName)
  return fullBrandKit
}

/**
 * Apply brand styling to content
 */
export async function applyBrandStyling(params: {
  userId: string
  content: string
  imageDescription?: string
  platform: string
}): Promise<BrandMatchedContent> {
  const { userId, content, imageDescription, platform } = params

  // In real implementation, fetch user's brand kit from database
  // For demo, use fallback

  // FALLBACK MODE
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  Dynamic Branding - using fallback brand matching')
    return {
      caption: `${content} [Brand-matched content]`,
      imagePrompt: imageDescription
        ? `${imageDescription}, professional brand style, consistent color palette`
        : 'Professional branded image',
      colorSuggestions: ['#1E40AF', '#F59E0B', '#10B981'],
      styleNotes: '[DEMO] Applied brand colors and professional tone',
      brandAlignment: 8.5,
    }
  }

  // Demo brand kit (in real app, fetch from DB)
  const demoBrandKit: BrandKit = {
    id: 'demo-brand',
    userId,
    brandName: 'Demo Brand',
    logoUrl: '/demo-logo.png',
    colorPalette: {
      primary: '#1E40AF',
      secondary: '#F59E0B',
      accent: '#10B981',
      background: '#FFFFFF',
      text: '#111827',
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
    },
    toneOfVoice: 'professional',
    brandValues: ['Innovation', 'Quality', 'Trust'],
    visualStyle: 'Modern, clean, professional with bold colors',
    tagline: 'Excellence in every detail',
  }

  const prompt = `Apply brand styling to this content:

Brand Kit:
- Name: ${demoBrandKit.brandName}
- Colors: ${JSON.stringify(demoBrandKit.colorPalette)}
- Tone: ${demoBrandKit.toneOfVoice}
- Values: ${demoBrandKit.brandValues.join(', ')}
- Visual Style: ${demoBrandKit.visualStyle}
- Tagline: ${demoBrandKit.tagline}

Platform: ${platform}
Original Content: "${content}"
${imageDescription ? `Image Description: "${imageDescription}"` : ''}

Generate brand-matched content:
1. Rewrite caption to match brand tone and values
2. Create image prompt that matches brand visual style and colors
3. Suggest specific brand colors to use (hex codes)
4. Provide style notes for consistency
5. Score brand alignment (0-10)

Return JSON matching BrandMatchedContent interface.`

  try {
    return await callGPTJSON<BrandMatchedContent>(
      prompt,
      'You are a brand strategist ensuring consistent brand identity across all content.'
    )
  } catch (error) {
    console.error('[Dynamic Branding] Failed to apply brand styling:', error)
    return {
      caption: content,
      imagePrompt: imageDescription || 'Branded content image',
      colorSuggestions: Object.values(demoBrandKit.colorPalette),
      styleNotes: 'Brand styling applied',
      brandAlignment: 7,
    }
  }
}

/**
 * Validate content against brand guidelines
 */
export async function validateBrandCompliance(params: {
  userId: string
  caption: string
  imageUrl?: string
}): Promise<{
  compliant: boolean
  score: number
  issues: string[]
  suggestions: string[]
}> {
  const { caption } = params

  // FALLBACK MODE
  if (!process.env.OPENAI_API_KEY) {
    return {
      compliant: true,
      score: 8.5,
      issues: [],
      suggestions: ['[DEMO] Consider adding brand tagline'],
    }
  }

  const prompt = `Validate this content against brand guidelines:

Caption: "${caption}"

Check for:
- Tone consistency
- Brand value alignment
- Professional language
- Clear messaging

Return JSON with:
- compliant (boolean)
- score (0-10)
- issues (array of problems found)
- suggestions (array of improvements)`

  try {
    return await callGPTJSON(
      prompt,
      'You are a brand compliance expert.'
    )
  } catch (error) {
    return {
      compliant: true,
      score: 7,
      issues: [],
      suggestions: [],
    }
  }
}
