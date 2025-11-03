import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Zap, Calendar, BarChart, Target, TrendingUp, Clock, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1e3a8a]">CohenGPT</h1>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm hover:text-[#1e3a8a] transition-colors">
              Features
            </Link>
            <Link href="#benefits" className="text-sm hover:text-[#1e3a8a] transition-colors">
              Benefits
            </Link>
            <Link href="/pricing" className="text-sm hover:text-[#1e3a8a] transition-colors">
              Pricing
            </Link>
            <Link href="/contact" className="text-sm hover:text-[#1e3a8a] transition-colors">
              Contact
            </Link>
            <Link href="/studio/image">
              <Button className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 transition-all hover:scale-105">
                Go to App
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#1e3a8a] to-blue-600 bg-clip-text text-transparent">
          AI-Powered Marketing<br />Made Simple
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Generate stunning ad-grade images, SEO-optimized content, and schedule posts across all platforms—all in one place
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/studio/image">
            <Button size="lg" className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 transition-all hover:scale-105">
              Start Creating
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a]/10 transition-all hover:scale-105">
              View Pricing
            </Button>
          </Link>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="container mx-auto px-4 py-20 bg-white rounded-lg shadow-sm mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6 text-[#1e3a8a]">About CohenGPT</h3>
          <p className="text-lg text-gray-700 mb-6">
            CohenGPT is your all-in-one AI marketing platform designed for small businesses, realtors, car dealerships, med spas, and restaurants. We combine cutting-edge AI technology with industry-specific templates to help you create professional marketing content in minutes—not hours.
          </p>
          <p className="text-lg text-gray-700">
            Our mission is to democratize professional marketing by making AI-powered tools accessible, affordable, and easy to use for businesses of all sizes.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h3 className="text-4xl font-bold mb-12 text-center text-[#1e3a8a]">Powerful Features</h3>
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

      {/* Benefits */}
      <section id="benefits" className="container mx-auto px-4 py-20 bg-gradient-to-r from-[#1e3a8a]/5 to-blue-50 rounded-lg">
        <h3 className="text-4xl font-bold mb-12 text-center text-[#1e3a8a]">Why Choose CohenGPT?</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
              <Clock className="w-8 h-8 text-[#1e3a8a]" />
            </div>
            <h4 className="font-semibold text-lg mb-2">Save Time</h4>
            <p className="text-gray-600 text-sm">
              Create professional content in minutes, not hours. Focus on growing your business.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
              <Target className="w-8 h-8 text-[#1e3a8a]" />
            </div>
            <h4 className="font-semibold text-lg mb-2">Industry Templates</h4>
            <p className="text-gray-600 text-sm">
              Pre-built templates for real estate, automotive, med spas, restaurants, and more.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
              <TrendingUp className="w-8 h-8 text-[#1e3a8a]" />
            </div>
            <h4 className="font-semibold text-lg mb-2">Boost Engagement</h4>
            <p className="text-gray-600 text-sm">
              Platform-optimized content designed to maximize reach and engagement.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
              <Shield className="w-8 h-8 text-[#1e3a8a]" />
            </div>
            <h4 className="font-semibold text-lg mb-2">Easy to Use</h4>
            <p className="text-gray-600 text-sm">
              No design or marketing experience needed. Our AI does the heavy lifting.
            </p>
          </div>
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
              <Button size="lg" className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 transition-all hover:scale-105">
                Get Started Now
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Free plan available
            </p>
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
