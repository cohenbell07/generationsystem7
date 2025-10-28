import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="border-b bg-white/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold">AI Marketer</h1>
          </Link>
          <Link href="/studio/image">
            <Button>Go to App</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Powerful Features for Modern Marketers</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to create, optimize, and schedule your marketing content
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          <div className="border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Image Generation Studio</h2>
            <ul className="space-y-3 text-gray-600">
              <li>• Choose between DALL·E 3 or Google Gemini Image models</li>
              <li>• Upload product images and composite them onto AI-generated backgrounds</li>
              <li>• Platform-specific presets (Instagram, Pinterest, Facebook, TikTok, LinkedIn, etc.)</li>
              <li>• One-click resize to other platform formats</li>
              <li>• Control product placement, scale, and rotation</li>
              <li>• Generate multiple variations per request</li>
            </ul>
          </div>

          <div className="border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">SEO Kit</h2>
            <ul className="space-y-3 text-gray-600">
              <li>• Platform-aware content generation (YouTube, Instagram, TikTok, LinkedIn, etc.)</li>
              <li>• Numeric SEO Score (0-100) with detailed breakdown</li>
              <li>• Specific improvement suggestions</li>
              <li>• Automatic keyword analysis and placement</li>
              <li>• Platform-specific tag/hashtag formatting</li>
              <li>• Multiple tone options (neutral, playful, luxury, authoritative)</li>
            </ul>
          </div>

          <div className="border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Post Scheduler & Calendar</h2>
            <ul className="space-y-3 text-gray-600">
              <li>• Visual calendar view of all scheduled posts</li>
              <li>• Multi-platform posting support</li>
              <li>• Draft, schedule, and publish posts</li>
              <li>• Attach generated images and SEO content</li>
              <li>• Automated posting with connected accounts (Pro)</li>
            </ul>
          </div>

          <div className="border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Analytics (Pro)</h2>
            <ul className="space-y-3 text-gray-600">
              <li>• Performance tracking across all platforms</li>
              <li>• Best-time suggestions based on engagement data</li>
              <li>• Automated posting at optimal times</li>
              <li>• Detailed metrics (impressions, clicks, engagement)</li>
              <li>• Cross-platform comparison</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/pricing">
            <Button size="lg">See Pricing</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
