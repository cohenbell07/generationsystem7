/**
 * API Route: Post Templates
 * GET /api/templates - List templates by industry
 * POST /api/templates/fill - Fill template with user data
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  ALL_TEMPLATES,
  getTemplatesByIndustry,
  getTemplateById,
  fillTemplate,
  getAllIndustries,
} from '@/lib/templates/industries'
import { db } from '@/lib/db'
import { callGPTJSON } from '@/lib/ai/llm'

// ============================================
// GET - List Templates
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const industry = searchParams.get('industry')
    const templateId = searchParams.get('id')

    // Get specific template
    if (templateId) {
      const template = getTemplateById(templateId)
      if (!template) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 })
      }
      return NextResponse.json({ template })
    }

    // Get templates by industry
    if (industry) {
      const templates = getTemplatesByIndustry(industry)
      return NextResponse.json({ templates, industry })
    }

    // Get all templates + industries list
    return NextResponse.json({
      templates: ALL_TEMPLATES,
      industries: getAllIndustries(),
    })
  } catch (error: any) {
    console.error('[API] Templates GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// ============================================
// POST - Fill Template or Auto-Complete
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, templateId, data, userId, autoFill } = body

    if (!templateId) {
      return NextResponse.json(
        { error: 'templateId is required' },
        { status: 400 }
      )
    }

    const template = getTemplateById(templateId)
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Action: Fill template with provided data
    if (action === 'fill' || !action) {
      const { caption, imagePrompt } = fillTemplate(template, data || {})

      // Save to database if userId provided
      if (userId) {
        await db.postTemplate.create({
          data: {
            userId,
            name: template.name,
            industry: template.industry,
            platform: template.platform,
            title: template.name,
            description: template.description,
            fields: JSON.stringify(template.fields),
            imagePrompt,
            captionTemplate: caption,
            isPublic: false,
          },
        })
      }

      return NextResponse.json({
        success: true,
        caption,
        imagePrompt,
        template: template.name,
      })
    }

    // Action: Auto-fill missing fields with AI
    if (action === 'autofill') {
      const partialData = data || {}
      const missingFields = template.fields.filter(
        (field) => !partialData[field.name] && field.required !== false
      )

      if (missingFields.length === 0) {
        return NextResponse.json({
          success: true,
          data: partialData,
          message: 'No missing fields to auto-fill',
        })
      }

      // Use AI to suggest values
      const prompt = `You are helping fill out a ${template.industry} social media post template for ${template.name}.

Template Description: ${template.description}

Already provided:
${JSON.stringify(partialData, null, 2)}

Missing fields to auto-fill:
${missingFields.map((f) => `- ${f.name} (${f.label}): ${f.placeholder || ''}`).join('\n')}

Generate realistic, engaging values for the missing fields. Return JSON with field names as keys and suggested values.

Example format:
{
  "fieldName": "suggested value",
  "anotherField": "another value"
}`

      try {
        const aiSuggestions = await callGPTJSON<Record<string, string>>(
          prompt,
          'You are a social media content expert.'
        )

        const completedData = { ...partialData, ...aiSuggestions }

        return NextResponse.json({
          success: true,
          data: completedData,
          aiSuggested: Object.keys(aiSuggestions),
        })
      } catch (aiError: any) {
        console.error('[API] Auto-fill AI error:', aiError)
        return NextResponse.json(
          { error: 'AI auto-fill failed', details: aiError.message },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('[API] Templates POST error:', error)
    return NextResponse.json(
      { error: 'Failed to process template', details: error.message },
      { status: 500 }
    )
  }
}
