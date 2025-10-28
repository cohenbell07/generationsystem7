'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Copy, CheckCircle2 } from 'lucide-react'
import { getAllPlatforms } from '@/lib/seo/platformProfiles'

export default function SEOStudioPage() {
  const [platform, setPlatform] = useState('youtube')
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('neutral')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const platforms = getAllPlatforms()

  const handleGenerate = async () => {
    if (!topic) {
      alert('Please enter a topic')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/seo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, topic, tone }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        alert(data.error || 'Generation failed')
      }
    } catch (error: any) {
      alert(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">SEO Studio</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Generate SEO Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Topic / URL / Product</Label>
                  <Textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., 'Winter skincare tips for dry skin' or paste a product URL"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="playful">Playful</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleGenerate} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate SEO Content'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {loading && (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </CardContent>
              </Card>
            )}

            {!loading && !result && (
              <Card>
                <CardContent className="text-center text-gray-500 py-12">
                  Configure settings and generate SEO-optimized content
                </CardContent>
              </Card>
            )}

            {result && (
              <>
                {/* SEO Score */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>SEO Score</CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="text-4xl font-bold">{result.scoreResult.score}</div>
                        <div className="text-gray-500">/100</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-green-700">What's Working:</h4>
                        <ul className="space-y-1">
                          {result.scoreResult.reasons.map((reason: string, i: number) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {result.scoreResult.improvements.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-orange-700">Improvements:</h4>
                          <ul className="space-y-1">
                            {result.scoreResult.improvements.map((imp: string, i: number) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <span className="text-orange-600">•</span>
                                <span>{imp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Title */}
                {result.title && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Title</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-2">
                        <p className="flex-1 font-medium">{result.title}</p>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(result.title)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Description */}
                {result.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-2">
                        <p className="flex-1">{result.description}</p>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(result.description)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tags / Hashtags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {result.tags.map((tag: string, i: number) => (
                        <Badge key={i} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(result.tags.join(' '))}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All Tags
                    </Button>
                  </CardContent>
                </Card>

                {/* Caption */}
                <Card>
                  <CardHeader>
                    <CardTitle>Caption</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-2">
                      <p className="flex-1">{result.caption}</p>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(result.caption)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
