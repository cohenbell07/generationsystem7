/**
 * Unified AI/LLM Wrapper
 * Provides consistent interfaces for GPT-4, Claude, and Gemini
 *
 * Usage:
 * - callGPT() for OpenAI GPT-4/GPT-4o
 * - callClaude() for Anthropic Claude
 * - callGemini() for Google Gemini (text-only)
 */

import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

// ============================================
// Types & Interfaces
// ============================================

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMResponse {
  content: string
  model: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  finishReason?: string
}

export interface LLMOptions {
  temperature?: number
  maxTokens?: number
  responseFormat?: 'text' | 'json'
  systemPrompt?: string
}

// ============================================
// Client Initialization
// ============================================

let openaiClient: OpenAI | null = null
let anthropicClient: Anthropic | null = null
let geminiClient: GoogleGenerativeAI | null = null

function getOpenAI(): OpenAI | null {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️  OPENAI_API_KEY not configured - fallback mode enabled')
      return null
    }
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return openaiClient
}

function getAnthropic(): Anthropic {
  if (!anthropicClient) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not configured')
    }
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return anthropicClient
}

function getGemini(): GoogleGenerativeAI {
  if (!geminiClient) {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      throw new Error('GOOGLE_GEMINI_API_KEY not configured')
    }
    geminiClient = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
  }
  return geminiClient
}

// ============================================
// GPT (OpenAI) Integration
// ============================================

/**
 * Call OpenAI GPT-4 or GPT-4o models
 * @param messages - Conversation messages
 * @param options - LLM options
 * @returns LLM response
 */
export async function callGPT(
  messages: LLMMessage[],
  options: LLMOptions = {}
): Promise<LLMResponse> {
  const client = getOpenAI()

  // FALLBACK MODE: If no API key, return dummy response
  if (!client) {
    console.log('⚠️  GPT unavailable - returning fallback response')
    const userMessage = messages.find(m => m.role === 'user')?.content || ''
    return {
      content: JSON.stringify({
        message: '[DEMO MODE] AI response would appear here',
        note: 'Add OPENAI_API_KEY to enable real AI responses',
        prompt: userMessage.substring(0, 100)
      }),
      model: 'demo-mode',
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      finishReason: 'fallback'
    }
  }

  const {
    temperature = 0.7,
    maxTokens = 2000,
    responseFormat = 'text',
  } = options

  try {
    console.log(`[GPT] Calling GPT-4o-mini with ${messages.length} messages`)

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature,
      max_tokens: maxTokens,
      response_format:
        responseFormat === 'json'
          ? { type: 'json_object' }
          : { type: 'text' },
    })

    const content = response.choices[0]?.message?.content || ''

    console.log(`[GPT] Response received: ${content.substring(0, 100)}...`)

    return {
      content,
      model: response.model,
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
      finishReason: response.choices[0]?.finish_reason,
    }
  } catch (error: any) {
    console.error('[GPT] Error:', error.message)
    throw new Error(`GPT call failed: ${error.message}`)
  }
}

/**
 * Shorthand for GPT with JSON response
 */
export async function callGPTJSON<T = any>(
  prompt: string,
  systemPrompt?: string
): Promise<T> {
  const messages: LLMMessage[] = [
    ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
    { role: 'user', content: prompt },
  ]

  const response = await callGPT(messages, { responseFormat: 'json' })
  return JSON.parse(response.content) as T
}

// ============================================
// Claude (Anthropic) Integration
// ============================================

/**
 * Call Anthropic Claude models
 * @param messages - Conversation messages (system removed, passed separately)
 * @param options - LLM options
 * @returns LLM response
 */
export async function callClaude(
  messages: LLMMessage[],
  options: LLMOptions = {}
): Promise<LLMResponse> {
  const client = getAnthropic()

  const {
    temperature = 0.7,
    maxTokens = 2000,
    systemPrompt,
  } = options

  // Extract system message if in messages array
  const systemMessage =
    systemPrompt ||
    messages.find((m) => m.role === 'system')?.content ||
    'You are a helpful AI marketing assistant.'

  const nonSystemMessages = messages.filter((m) => m.role !== 'system')

  try {
    console.log(`[Claude] Calling Claude with ${nonSystemMessages.length} messages`)

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022', // Latest Claude model
      max_tokens: maxTokens,
      temperature,
      system: systemMessage,
      messages: nonSystemMessages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    })

    const content =
      response.content[0]?.type === 'text'
        ? response.content[0].text
        : ''

    console.log(`[Claude] Response received: ${content.substring(0, 100)}...`)

    return {
      content,
      model: response.model,
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
      finishReason: response.stop_reason || undefined,
    }
  } catch (error: any) {
    console.error('[Claude] Error:', error.message)
    throw new Error(`Claude call failed: ${error.message}`)
  }
}

/**
 * Shorthand for Claude with JSON response
 */
export async function callClaudeJSON<T = any>(
  prompt: string,
  systemPrompt?: string
): Promise<T> {
  const messages: LLMMessage[] = [
    { role: 'user', content: `${prompt}\n\nRespond with valid JSON only.` },
  ]

  const response = await callClaude(messages, {
    systemPrompt:
      (systemPrompt || '') +
      '\n\nYou must respond with valid JSON only. No explanatory text.',
  })

  return JSON.parse(response.content) as T
}

// ============================================
// Gemini (Google) Integration - Text Only
// ============================================

/**
 * Call Google Gemini for text generation (non-multimodal)
 * @param messages - Conversation messages
 * @param options - LLM options
 * @returns LLM response
 */
export async function callGemini(
  messages: LLMMessage[],
  options: LLMOptions = {}
): Promise<LLMResponse> {
  const client = getGemini()

  const {
    temperature = 0.7,
    maxTokens = 2000,
    systemPrompt,
  } = options

  try {
    console.log(`[Gemini] Calling Gemini with ${messages.length} messages`)

    const model = client.getGenerativeModel({
      model: 'gemini-1.5-pro',
    })

    // Combine system prompt + messages
    const systemMessage =
      systemPrompt || messages.find((m) => m.role === 'system')?.content || ''

    const conversationHistory = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }))

    const chat = model.startChat({
      history: conversationHistory.slice(0, -1), // All but last message
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    })

    const lastMessage = conversationHistory[conversationHistory.length - 1]
    const fullPrompt = systemMessage
      ? `${systemMessage}\n\n${lastMessage.parts[0].text}`
      : lastMessage.parts[0].text

    const result = await chat.sendMessage(fullPrompt)
    const content = result.response.text()

    console.log(`[Gemini] Response received: ${content.substring(0, 100)}...`)

    return {
      content,
      model: 'gemini-1.5-pro',
      usage: {
        promptTokens: 0, // Gemini doesn't provide token counts easily
        completionTokens: 0,
        totalTokens: 0,
      },
    }
  } catch (error: any) {
    console.error('[Gemini] Error:', error.message)
    throw new Error(`Gemini call failed: ${error.message}`)
  }
}

// ============================================
// Utility Functions
// ============================================

/**
 * Auto-select best LLM for task
 * Priority: Claude > GPT > Gemini
 */
export async function callBestLLM(
  messages: LLMMessage[],
  options: LLMOptions = {}
): Promise<LLMResponse> {
  // Try Claude first (best for complex reasoning)
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      return await callClaude(messages, options)
    } catch (error) {
      console.warn('[LLM] Claude failed, trying GPT...')
    }
  }

  // Fallback to GPT
  if (process.env.OPENAI_API_KEY) {
    try {
      return await callGPT(messages, options)
    } catch (error) {
      console.warn('[LLM] GPT failed, trying Gemini...')
    }
  }

  // Last resort: Gemini
  if (process.env.GOOGLE_GEMINI_API_KEY) {
    try {
      return await callGemini(messages, options)
    } catch (error) {
      console.warn('[LLM] All AI providers failed')
    }
  }

  // FALLBACK MODE: Return dummy response if no API keys configured
  console.log('⚠️  No LLM API keys configured - returning fallback response')
  const userMessage = messages.find(m => m.role === 'user')?.content || ''
  return {
    content: JSON.stringify({
      message: '[DEMO MODE] AI response would appear here',
      note: 'Add AI API keys to enable real AI responses',
      prompt: userMessage.substring(0, 100)
    }),
    model: 'demo-mode',
    usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    finishReason: 'fallback'
  }
}

/**
 * Quick one-shot prompt (uses best available LLM)
 */
export async function quickPrompt(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const messages: LLMMessage[] = [
    ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
    { role: 'user', content: prompt },
  ]

  const response = await callBestLLM(messages)
  return response.content
}

/**
 * Quick JSON prompt (uses GPT for guaranteed JSON)
 */
export async function quickJSONPrompt<T = any>(
  prompt: string,
  systemPrompt?: string
): Promise<T> {
  return await callGPTJSON<T>(prompt, systemPrompt)
}

// ============================================
// Specialized Marketing AI Functions
// ============================================

/**
 * Generate marketing copy with AI
 */
export async function generateMarketingCopy(params: {
  platform: string
  topic: string
  tone?: string
  targetAudience?: string
  includeHashtags?: boolean
}): Promise<{
  headline: string
  body: string
  callToAction: string
  hashtags?: string[]
}> {
  const systemPrompt = `You are an expert marketing copywriter. Generate compelling, platform-optimized marketing copy.`

  const prompt = `Create marketing copy for ${params.platform}:

Topic: ${params.topic}
Tone: ${params.tone || 'professional'}
Target Audience: ${params.targetAudience || 'general'}
Include Hashtags: ${params.includeHashtags ? 'yes' : 'no'}

Return JSON with: headline, body, callToAction${params.includeHashtags ? ', hashtags (array)' : ''}`

  return await callGPTJSON(prompt, systemPrompt)
}

/**
 * Analyze content performance and give recommendations
 */
export async function analyzeContentPerformance(params: {
  contentType: string
  metrics: {
    impressions: number
    engagement: number
    clicks: number
  }
  historicalAvg: {
    impressions: number
    engagement: number
    clicks: number
  }
}): Promise<{
  score: number
  insights: string[]
  recommendations: string[]
}> {
  const systemPrompt = `You are a data-driven marketing analyst. Analyze performance metrics and provide actionable insights.`

  const prompt = `Analyze this ${params.contentType} performance:

Current Metrics:
- Impressions: ${params.metrics.impressions}
- Engagement: ${params.metrics.engagement}
- Clicks: ${params.metrics.clicks}

Historical Average:
- Impressions: ${params.historicalAvg.impressions}
- Engagement: ${params.historicalAvg.engagement}
- Clicks: ${params.historicalAvg.clicks}

Return JSON with:
- score (0-10)
- insights (array of strings)
- recommendations (array of actionable steps)`

  return await callGPTJSON(prompt, systemPrompt)
}

/**
 * Generate strategic marketing advice
 */
export async function generateMarketingStrategy(params: {
  industry: string
  currentMetrics: any
  goals: string[]
}): Promise<{
  weeklyRecommendations: string[]
  contentPillars: string[]
  priorityActions: string[]
  expectedImpact: string
}> {
  const systemPrompt = `You are a senior marketing strategist with expertise in social media growth and content strategy.`

  const prompt = `Create a marketing strategy for a ${params.industry} business:

Current Metrics: ${JSON.stringify(params.currentMetrics)}
Goals: ${params.goals.join(', ')}

Provide a structured strategy with:
- weeklyRecommendations (3-5 specific actions)
- contentPillars (3-4 main content themes)
- priorityActions (top 3 immediate actions)
- expectedImpact (realistic outcome prediction)

Return as JSON.`

  return await callGPTJSON(prompt, systemPrompt)
}
