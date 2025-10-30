'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PLATFORM_PRESETS } from '@/lib/utils'
import { Loader2, Download } from 'lucide-react'

export default function ImageStudioPage() {
  const [model, setModel] = useState('dalle')
  const [prompt, setPrompt] = useState('')
  const [preset, setPreset] = useState('instagram')
  const [productFile, setProductFile] = useState<File | null>(null)
  const [preserveProduct, setPreserveProduct] = useState(false)
  const [placement, setPlacement] = useState('center')
  const [scale, setScale] = useState(0.8)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const handleGenerate = async () => {
    if (!prompt) {
      alert('Please enter a prompt')
      return
    }

    setLoading(true)
    setResults([])

    try {
      // Upload product image if provided
      let productImageUrl = null
      if (productFile && preserveProduct) {
        const formData = new FormData()
        formData.append('file', productFile)

        const uploadRes = await fetch('/api/uploads', {
          method: 'POST',
          body: formData,
        })
        const uploadData = await uploadRes.json()
        productImageUrl = uploadData.url
      }

      // Generate images
      const presetInfo = PLATFORM_PRESETS[preset as keyof typeof PLATFORM_PRESETS]

      const response = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
          width: presetInfo.width,
          height: presetInfo.height,
          platform: preset,
          productImage: productImageUrl,
          preserveProduct: preserveProduct && !!productImageUrl,
          placement,
          scale,
          rotation: 0,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResults(data.assets)
      } else {
        alert(data.error || 'Generation failed')
      }
    } catch (error: any) {
      alert(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Image Studio</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Model & Prompt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>AI Model</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dalle">DALL·E 3</SelectItem>
                      <SelectItem value="gemini">Google Gemini 1.5 Pro Vision</SelectItem>
                      <SelectItem value="runway">Runway ML Gen-2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Prompt</Label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Platform Preset</Label>
                  <Select value={preset} onValueChange={setPreset}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PLATFORM_PRESETS).map(([key, val]) => (
                        <SelectItem key={key} value={key}>
                          {val.name} ({val.width}×{val.height})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Compositing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Upload Product Image (Optional)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProductFile(e.target.files?.[0] || null)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="preserve"
                    checked={preserveProduct}
                    onChange={(e) => setPreserveProduct(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="preserve">Preserve & composite product</Label>
                </div>

                {preserveProduct && (
                  <>
                    <div>
                      <Label>Placement</Label>
                      <Select value={placement} onValueChange={setPlacement}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Scale: {scale}</Label>
                      <input
                        type="range"
                        min="0.3"
                        max="1"
                        step="0.1"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </>
                )}

                <Button onClick={handleGenerate} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Images'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Generated Images</CardTitle>
              </CardHeader>
              <CardContent>
                {loading && (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                )}

                {!loading && results.length === 0 && (
                  <div className="text-center text-gray-500 py-12">
                    No images generated yet. Configure settings and click Generate.
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {results.map((asset) => (
                    <div key={asset.id} className="border rounded-lg overflow-hidden">
                      <div className="relative aspect-square bg-gray-100">
                        <img
                          src={asset.url}
                          alt={asset.prompt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="text-sm text-gray-600 line-clamp-2">{asset.prompt}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Resize
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                          {asset.width}×{asset.height} • {asset.model} • ${asset.costEstimate.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
