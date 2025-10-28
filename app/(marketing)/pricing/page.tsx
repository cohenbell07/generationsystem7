import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { PLANS } from '@/lib/plans'

export default function PricingPage() {
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
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Choose the tools you need, or bundle and save</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Image Studio */}
          <Card>
            <CardHeader>
              <CardTitle>Image Studio</CardTitle>
              <div className="text-3xl font-bold">${PLANS.IMAGE.price}<span className="text-sm font-normal text-gray-500">/mo</span></div>
              <CardDescription>Standalone Image Generation</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {PLANS.IMAGE.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full">Get Image Studio</Button>
            </CardContent>
          </Card>

          {/* SEO Studio */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Studio</CardTitle>
              <div className="text-3xl font-bold">${PLANS.SEO.price}<span className="text-sm font-normal text-gray-500">/mo</span></div>
              <CardDescription>Standalone SEO Tools</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {PLANS.SEO.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full">Get SEO Studio</Button>
            </CardContent>
          </Card>

          {/* Bundle */}
          <Card className="border-2 border-purple-600 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                BEST VALUE
              </span>
            </div>
            <CardHeader>
              <CardTitle>Complete Bundle</CardTitle>
              <div className="text-3xl font-bold">${PLANS.BUNDLE.price}<span className="text-sm font-normal text-gray-500">/mo</span></div>
              <CardDescription>Everything You Need</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {PLANS.BUNDLE.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Get Bundle</Button>
            </CardContent>
          </Card>

          {/* Pro Add-On */}
          <Card>
            <CardHeader>
              <CardTitle>Pro Add-On</CardTitle>
              <div className="text-3xl font-bold">+${PLANS.PRO.price}<span className="text-sm font-normal text-gray-500">/mo</span></div>
              <CardDescription>Advanced Features</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {PLANS.PRO.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant="outline">Upgrade to Pro</Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Not sure which plan to choose?</p>
          <Link href="/contact">
            <Button variant="outline">Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
