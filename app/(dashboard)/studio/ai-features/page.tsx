'use client'

/**
 * AI Features Hub
 * Central dashboard for all AI-powered marketing features
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface Feature {
  id: string
  name: string
  description: string
  phase: 1 | 2 | 3
  category: 'content' | 'analytics' | 'automation' | 'engagement' | 'growth'
  status: 'available' | 'beta' | 'coming-soon'
  demoMode: boolean
  route?: string
  apiEndpoint?: string
}

const ALL_FEATURES: Feature[] = [
  // Phase 1 Features
  {
    id: 'marketing-brain',
    name: 'AI Marketing Brain',
    description: 'Weekly strategic analysis and actionable recommendations based on your content performance',
    phase: 1,
    category: 'analytics',
    status: 'available',
    demoMode: true,
    apiEndpoint: '/api/marketing/brain',
  },
  {
    id: 'auto-iterate',
    name: 'Auto-Iterate A/B Testing',
    description: 'Automatically test variations, track results, and optimize content performance',
    phase: 1,
    category: 'automation',
    status: 'available',
    demoMode: true,
    apiEndpoint: '/api/marketing/autoiterate',
  },
  {
    id: 'dynamic-branding',
    name: 'Dynamic Branding AI',
    description: 'Upload your brand kit once, AI matches all future content to your style',
    phase: 1,
    category: 'content',
    status: 'available',
    demoMode: true,
    apiEndpoint: '/api/marketing/branding',
  },
  {
    id: 'performance-predictor',
    name: 'Predictive Performance Engine',
    description: 'Estimate engagement, reach, and conversions before posting',
    phase: 1,
    category: 'analytics',
    status: 'available',
    demoMode: true,
    route: '/studio/analytics',
  },
  {
    id: 'cross-platform',
    name: 'Cross-Platform Auto-Optimization',
    description: 'Auto-reformat content for TikTok, Instagram, Facebook, YouTube with perfect sizing',
    phase: 1,
    category: 'automation',
    status: 'available',
    demoMode: true,
    route: '/studio/image',
  },
  // Phase 2 Features
  {
    id: 'ad-manager',
    name: 'AI Ad Manager',
    description: 'Convert organic content to paid ads, manage Meta/Google/TikTok campaigns',
    phase: 2,
    category: 'growth',
    status: 'available',
    demoMode: true,
    apiEndpoint: '/api/marketing/ads',
  },
  {
    id: 'competitor-intel',
    name: 'AI Competitor Intelligence',
    description: 'Analyze public content of competitors, identify opportunities',
    phase: 2,
    category: 'analytics',
    status: 'available',
    demoMode: true,
    apiEndpoint: '/api/marketing/competitors',
  },
  {
    id: 'hashtag-tracker',
    name: 'AI Hashtag & Trend Tracker',
    description: 'Discover trending topics per niche, optimize hashtag strategy',
    phase: 2,
    category: 'content',
    status: 'available',
    demoMode: true,
    apiEndpoint: '/api/marketing/hashtags',
  },
  {
    id: 'calendar-autofill',
    name: 'AI Content Calendar Auto-Fill',
    description: 'Fill your calendar with AI-generated post drafts (hook, caption, hashtags, CTA)',
    phase: 2,
    category: 'automation',
    status: 'available',
    demoMode: true,
    route: '/studio/scheduler',
  },
  {
    id: 'recommendations',
    name: 'Next-Level Recommendations',
    description: 'AI-powered tips and goals (e.g., "Add CTA at second 4")',
    phase: 2,
    category: 'analytics',
    status: 'available',
    demoMode: true,
    apiEndpoint: '/api/marketing/recommendations',
  },
  // Phase 3 Features
  {
    id: 'crm-lead-nurture',
    name: 'AI CRM & Lead Nurture',
    description: 'Simulate lead capture, scoring, and automated reply logic',
    phase: 3,
    category: 'engagement',
    status: 'available',
    demoMode: true,
  },
  {
    id: 'reputation-manager',
    name: 'AI Reputation Manager',
    description: 'Monitor mentions/comments, auto-detect sentiment, suggest replies',
    phase: 3,
    category: 'engagement',
    status: 'available',
    demoMode: true,
    apiEndpoint: '/api/marketing/reputation',
  },
  // Core Tools
  {
    id: 'image-generation',
    name: 'AI Image Generation',
    description: 'Generate images with DALL-E, Gemini, or Runway',
    phase: 1,
    category: 'content',
    status: 'available',
    demoMode: true,
    route: '/studio/image',
  },
  {
    id: 'seo-studio',
    name: 'SEO Studio',
    description: 'Platform-aware SEO content generation with scoring',
    phase: 1,
    category: 'content',
    status: 'available',
    demoMode: true,
    route: '/studio/seo',
  },
  {
    id: 'templates',
    name: 'Industry Templates',
    description: 'Pre-built templates for Realtor, Auto, Med Spa, Restaurant',
    phase: 1,
    category: 'content',
    status: 'available',
    demoMode: true,
    route: '/studio/templates',
  },
]

export default function AIFeaturesHub() {
  const [selectedPhase, setSelectedPhase] = useState<'all' | 1 | 2 | 3>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredFeatures = ALL_FEATURES.filter((f) => {
    if (selectedPhase !== 'all' && f.phase !== selectedPhase) return false
    if (selectedCategory !== 'all' && f.category !== selectedCategory) return false
    return true
  })

  const categories = ['all', 'content', 'analytics', 'automation', 'engagement', 'growth']

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">AI Features Hub</h1>
        <p className="text-gray-600 text-lg">
          All AI-powered features are unlocked and ready to use in demo mode
        </p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Demo Mode:</strong> All features work without API keys. Add API keys in .env to enable real functionality.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="text-sm font-medium mr-2">Phase:</label>
          {['all', 1, 2, 3].map((phase) => (
            <Button
              key={phase}
              variant={selectedPhase === phase ? 'default' : 'outline'}
              size="sm"
              className="mr-2"
              onClick={() => setSelectedPhase(phase as any)}
            >
              {phase === 'all' ? 'All' : `Phase ${phase}`}
            </Button>
          ))}
        </div>
        <div>
          <label className="text-sm font-medium mr-2">Category:</label>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              className="mr-2 capitalize"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature) => (
          <Card key={feature.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary">Phase {feature.phase}</Badge>
                {feature.demoMode && (
                  <Badge variant="outline" className="bg-green-50">
                    Demo Ready
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl">{feature.name}</CardTitle>
              <CardDescription className="capitalize">
                {feature.category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
              {feature.route ? (
                <Link href={feature.route}>
                  <Button className="w-full" size="sm">
                    Open Feature
                  </Button>
                </Link>
              ) : feature.apiEndpoint ? (
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => {
                    alert(
                      `API Endpoint: ${feature.apiEndpoint}\n\nThis feature is available via API. Integrate it into your workflow or check the API documentation.`
                    )
                  }}
                >
                  View API
                </Button>
              ) : (
                <Button className="w-full" size="sm" variant="secondary">
                  Coming Soon
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ALL_FEATURES.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Phase 1</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {ALL_FEATURES.filter((f) => f.phase === 1).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Phase 2</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {ALL_FEATURES.filter((f) => f.phase === 2).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Phase 3</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {ALL_FEATURES.filter((f) => f.phase === 3).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Quick Start</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Most Popular</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/studio/image" className="text-blue-600 hover:underline">
                  → AI Image Generation
                </Link>
              </li>
              <li>
                <Link href="/studio/seo" className="text-blue-600 hover:underline">
                  → SEO Studio
                </Link>
              </li>
              <li>
                <Link href="/studio/templates" className="text-blue-600 hover:underline">
                  → Industry Templates
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Advanced Features</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-600">→ AI Marketing Brain (API)</li>
              <li className="text-gray-600">→ Competitor Intelligence (API)</li>
              <li className="text-gray-600">→ Reputation Manager (API)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
