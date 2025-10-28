'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock, TrendingUp, Clock, Zap } from 'lucide-react'
import Link from 'next/link'

export default function AnalyticsPage() {
  // This is a Pro feature, so show upgrade prompt
  const isPro = false // In real app, check user's plan

  if (!isPro) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Analytics & Insights</h1>
            <p className="text-gray-600">
              Unlock powerful analytics and autoposting with the Pro add-on
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Performance Tracking</CardTitle>
                <CardDescription>
                  Track impressions, clicks, and engagement across all platforms
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>Best-Time Suggestions</CardTitle>
                <CardDescription>
                  AI-powered recommendations for optimal posting times
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-8 h-8 text-orange-600 mb-2" />
                <CardTitle>Autoposting</CardTitle>
                <CardDescription>
                  Automatically publish posts at peak engagement times
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="border-2 border-purple-600">
            <CardHeader>
              <CardTitle className="text-2xl">Upgrade to Pro</CardTitle>
              <CardDescription>
                Add Pro features to your existing plan for just $29/month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Detailed performance analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Best-time posting suggestions</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Automated posting</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Advanced engagement metrics</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Cross-platform comparison</span>
                </li>
              </ul>

              <Link href="/pricing">
                <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700">
                  Upgrade to Pro - $29/month
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // If user has Pro, show analytics dashboard (mocked)
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
        {/* Analytics content would go here */}
      </div>
    </div>
  )
}
