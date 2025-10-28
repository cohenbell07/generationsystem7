'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Video, Upload } from 'lucide-react'

export default function VideoPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [brand, setBrand] = useState('')
  const [brief, setBrief] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would submit to an API
    console.log('Video brief submitted:', { name, email, brand, brief })

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setName('')
      setEmail('')
      setBrand('')
      setBrief('')
    }, 3000)
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Video className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Video Production</h1>
          <p className="text-gray-600">Manual Service for Premium Quality</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>High-Quality Video Production</CardTitle>
            <CardDescription>
              We currently produce videos manually to ensure the highest quality output. Submit your
              brief below and our team will get back to you within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Brief Submitted!</h3>
                <p className="text-gray-600">
                  We'll review your request and get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="brand">Brand / Company</Label>
                  <Input
                    id="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <Label htmlFor="brief">Video Brief</Label>
                  <Textarea
                    id="brief"
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder="Describe your video needs: concept, style, length, target audience, key messages, etc."
                    rows={8}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="assets">Brand Assets (Optional)</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-gray-400 transition cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Click to upload logos, product images, or brand guidelines
                    </p>
                    <Input
                      id="assets"
                      type="file"
                      multiple
                      className="hidden"
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Submit Video Brief
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Social Media Videos</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              TikTok, Reels, YouTube Shorts - optimized for each platform
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Demos</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              Showcase your products with professional demonstrations
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Brand Stories</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              Tell your brand's story with compelling video content
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
