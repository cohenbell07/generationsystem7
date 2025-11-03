import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="border-b bg-white/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold">CohenGPT</h1>
          </Link>
          <div className="flex gap-2">
            <Link href="/pricing">
              <Button variant="outline">Pricing</Button>
            </Link>
            <Link href="/studio/image">
              <Button>Go to App</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">About CohenGPT</h1>
            <p className="text-xl text-gray-600">AI-Powered Marketing Tools for Modern Businesses</p>
          </div>

          <div className="space-y-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  CohenGPT empowers businesses to create stunning visual content, optimize their social media presence, 
                  and automate their marketing workflow. We combine the power of cutting-edge AI with intuitive design 
                  to make professional marketing accessible to everyone.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>What We Offer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Image Generation Studio</h3>
                    <p className="text-gray-700 text-sm">
                      Create professional images using DALL·E, Gemini, and Runway ML. All models support photo input, 
                      allowing you to composite products, customize backgrounds, and generate platform-optimized visuals.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">SEO Optimization Studio</h3>
                    <p className="text-gray-700 text-sm">
                      Generate SEO-optimized content with hashtags, meta descriptions, and keyword suggestions. 
                      Get platform-specific recommendations to maximize your reach and engagement.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Smart Post Scheduler</h3>
                    <p className="text-gray-700 text-sm">
                      Schedule posts manually or enable smart auto-posting that publishes at optimal times based on 
                      audience engagement patterns. Manage all your social media content from one place.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Why Choose CohenGPT?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span className="text-gray-700">All-in-one platform for image generation, SEO optimization, and social media management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span className="text-gray-700">Auto-resize content for TikTok, Instagram, Facebook, and more</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span className="text-gray-700">Industry-specific templates with AI-powered customization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span className="text-gray-700">Transparent pricing with flexible plans for every business size</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">✓</span>
                    <span className="text-gray-700">Manual video processing service for high-quality video content</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-gradient-to-r from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle>Get Started Today</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Ready to transform your marketing workflow? Choose a plan that fits your needs and start creating 
                  professional content in minutes.
                </p>
                <Link href="/pricing">
                  <Button size="lg" className="transition-smooth hover:scale-105">
                    View Pricing Plans
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

