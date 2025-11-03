'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Loader2 } from 'lucide-react'
import { PLANS } from '@/lib/plans'
import { useToast } from '@/components/ui/use-toast'

export default function PricingPage() {
  const { toast } = useToast()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    setLoadingPlan(planId)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userId: 'demo-user-123',
        }),
      })

      const data = await response.json()

      if (data.success && data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create checkout')
      }
    } catch (error: any) {
      toast({
        title: 'Subscription failed',
        description: error.message || 'Could not initiate checkout. Please try again.',
        variant: 'destructive',
      })
      setLoadingPlan(null)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="border-b bg-white/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold">CohenGPT</h1>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Starter Plan */}
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>{PLANS.STARTER.name}</CardTitle>
              <div className="text-3xl font-bold">${PLANS.STARTER.price}<span className="text-sm font-normal text-gray-500">/mo</span></div>
              <CardDescription>Perfect for getting started</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {PLANS.STARTER.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full transition-smooth hover:scale-105" 
                onClick={() => handleSubscribe('STARTER')}
                disabled={loadingPlan === 'STARTER'}
              >
                {loadingPlan === 'STARTER' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Get Started'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Bundle */}
          <Card className="border-2 border-purple-600 relative hover:shadow-xl transition-shadow duration-300 hover:scale-105">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                BEST VALUE
              </span>
            </div>
            <CardHeader>
              <CardTitle>{PLANS.BUNDLE.name}</CardTitle>
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
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 transition-smooth hover:scale-105" 
                onClick={() => handleSubscribe('BUNDLE')}
                disabled={loadingPlan === 'BUNDLE'}
              >
                {loadingPlan === 'BUNDLE' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Get Bundle'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Pro */}
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>{PLANS.PRO.name}</CardTitle>
              <div className="text-3xl font-bold">${PLANS.PRO.price}<span className="text-sm font-normal text-gray-500">/mo</span></div>
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
              <Button 
                className="w-full transition-smooth hover:scale-105" 
                onClick={() => handleSubscribe('PRO')}
                disabled={loadingPlan === 'PRO'}
              >
                {loadingPlan === 'PRO' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Upgrade to Pro'
                )}
              </Button>
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
