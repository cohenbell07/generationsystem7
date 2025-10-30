import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Zap, Calendar, BarChart } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">CohenGPT</h1>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm hover:underline">
              Features
            </Link>
            <Link href="/pricing" className="text-sm hover:underline">
              Pricing
            </Link>
            <Link href="/contact" className="text-sm hover:underline">
              Contact
            </Link>
            <Link href="/studio/image">
              <Button>Go to App</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          AI-Powered Marketing<br />Made Simple
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Generate stunning ad-grade images, SEO-optimized content, and schedule posts across all platforms—all in one place
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/studio/image">
            <Button size="lg">Start Creating</Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline">
              View Pricing
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Sparkles className="w-10 h-10 text-purple-600 mb-2" />
              <CardTitle>Image Studio</CardTitle>
              <CardDescription>
                Generate ad-grade images with DALL·E or Gemini. Upload products and composite them seamlessly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/studio/image">
                <Button variant="ghost" className="w-full">
                  Try Image Studio →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-10 h-10 text-blue-600 mb-2" />
              <CardTitle>SEO Kit</CardTitle>
              <CardDescription>
                Platform-aware SEO content with scoring. Get titles, descriptions, tags, and actionable improvements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/studio/seo">
                <Button variant="ghost" className="w-full">
                  Try SEO Kit →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="w-10 h-10 text-green-600 mb-2" />
              <CardTitle>Scheduler</CardTitle>
              <CardDescription>
                Queue posts for multiple platforms. Manage your content calendar in one place.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/studio/scheduler">
                <Button variant="ghost" className="w-full">
                  Try Scheduler →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart className="w-10 h-10 text-orange-600 mb-2" />
              <CardTitle>Analytics (Pro)</CardTitle>
              <CardDescription>
                Track performance, get best-time suggestions, and enable autoposting with Pro.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/pricing">
                <Button variant="ghost" className="w-full">
                  Upgrade to Pro →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-2xl mx-auto border-2">
          <CardHeader>
            <CardTitle className="text-3xl">Ready to transform your marketing?</CardTitle>
            <CardDescription className="text-lg">
              Start creating professional content in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/studio/image">
              <Button size="lg" className="w-full">
                Get Started Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>&copy; 2024 CohenGPT. All rights reserved.</p>
          <div className="flex gap-4 justify-center mt-4">
            <Link href="/features" className="hover:underline">
              Features
            </Link>
            <Link href="/pricing" className="hover:underline">
              Pricing
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
