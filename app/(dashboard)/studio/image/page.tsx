'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PLATFORM_PRESETS } from '@/lib/utils'
import { Loader2, Download, Sparkles, Maximize2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import {
  ALL_TEMPLATES,
  getAllIndustries,
  getIndustryDisplayName,
  getTemplatesByIndustry,
  fillTemplate,
  type PostTemplateData,
} from '@/lib/templates/industries'

export default function ImageStudioPage() {
  const { toast } = useToast()
  const [model, setModel] = useState('dalle')
  const [prompt, setPrompt] = useState('')
  const [preset, setPreset] = useState('instagram')
  const [productFile, setProductFile] = useState<File | null>(null)
  const [preserveProduct, setPreserveProduct] = useState(false)
  const [placement, setPlacement] = useState('center')
  const [scale, setScale] = useState(0.8)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [generatingStatus, setGeneratingStatus] = useState('')

  // Template states
  const [useTemplate, setUseTemplate] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<PostTemplateData | null>(null)
  const [templateData, setTemplateData] = useState<Record<string, string>>({})
  const [generatedCaption, setGeneratedCaption] = useState('')

  const industries = getAllIndustries()

  // Update template options when industry changes
  const availableTemplates = selectedIndustry ? getTemplatesByIndustry(selectedIndustry) : []

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = availableTemplates.find((t) => t.id === templateId)
    setSelectedTemplate(template || null)
    setTemplateData({})
    setGeneratedCaption('')
  }

  // Handle template data change
  const handleTemplateDataChange = (fieldName: string, value: string) => {
    setTemplateData((prev) => ({ ...prev, [fieldName]: value }))
  }

  // Generate from template
  const handleGenerateFromTemplate = () => {
    if (!selectedTemplate) return

    const { caption, imagePrompt } = fillTemplate(selectedTemplate, templateData)
    setPrompt(imagePrompt)
    setGeneratedCaption(caption)
    setPreset(selectedTemplate.platform as keyof typeof PLATFORM_PRESETS || 'instagram')

    toast({
      title: 'Template applied!',
      description: 'Image prompt and caption generated from template.',
    })
  }

  const handleDownload = async (imageUrl: string, filename: string) => {
    try {
      // Ensure we have the full URL path
      const url = imageUrl.startsWith('http') ? imageUrl : `${window.location.origin}${imageUrl}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch image')
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = filename || 'generated-image.png'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)

      toast({
        title: 'Download started',
        description: 'Your image is being downloaded.',
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: 'Download failed',
        description: 'Could not download the image. Please try again.',
      })
    }
  }

  const handleResize = async (assetId: string, targetPlatform: string) => {
    try {
      setLoading(true)
      const response = await fetch('/api/image/resize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId, targetPlatform }),
      })

      const data = await response.json()

      if (data.success) {
        setResults((prev) => [...prev, data.asset])
        toast({
          title: 'Image resized!',
          description: `Resized for ${PLATFORM_PRESETS[targetPlatform as keyof typeof PLATFORM_PRESETS]?.name}`,
        })
      } else {
        throw new Error(data.error || 'Resize failed')
      }
    } catch (error: any) {
      toast({
        title: 'Resize failed',
        description: error.message || 'Could not resize the image.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: 'Missing prompt',
        description: 'Please enter a prompt to generate images.',
      })
      return
    }

    setLoading(true)
    setResults([])
    setGeneratingStatus('Preparing to generate...')

    try {
      // Upload product image if provided
      let productImageUrl = null
      if (productFile && preserveProduct) {
        setGeneratingStatus('Uploading product image...')
        const formData = new FormData()
        formData.append('file', productFile)

        const uploadRes = await fetch('/api/uploads', {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) {
          throw new Error('Failed to upload product image')
        }

        const uploadData = await uploadRes.json()
        productImageUrl = uploadData.url
      }

      // Generate images
      setGeneratingStatus(`Generating with ${model === 'dalle' ? 'DALL·E 3' : model === 'gemini' ? 'Gemini' : 'Runway'}...`)
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
        toast({
          title: 'Images generated successfully!',
          description: `Generated ${data.assets.length} image(s) with ${model.toUpperCase()}.`,
        })
      } else {
        throw new Error(data.error || 'Generation failed')
      }
    } catch (error: any) {
      toast({
        title: 'Image generation failed',
        description: error.message || 'An error occurred. Please try again.',
      })
    } finally {
      setLoading(false)
      setGeneratingStatus('')
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
                <CardTitle>Create Your Post</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="custom" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="custom">Custom Prompt</TabsTrigger>
                    <TabsTrigger value="template">
                      <Sparkles className="w-4 h-4 mr-1" />
                      Template
                    </TabsTrigger>
                  </TabsList>

                  {/* Custom Prompt Tab */}
                  <TabsContent value="custom" className="space-y-4">
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
                  </TabsContent>

                  {/* Template Tab */}
                  <TabsContent value="template" className="space-y-4">
                    <div>
                      <Label>Industry</Label>
                      <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry..." />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {getIndustryDisplayName(industry)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedIndustry && (
                      <div>
                        <Label>Template</Label>
                        <Select value={selectedTemplate?.id || ''} onValueChange={handleTemplateSelect}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select template..." />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTemplates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedTemplate && (
                          <p className="text-xs text-gray-500 mt-1">{selectedTemplate.description}</p>
                        )}
                      </div>
                    )}

                    {selectedTemplate && (
                      <>
                        <div className="space-y-3 pt-2">
                          <Label className="text-sm font-semibold">Fill Template Fields:</Label>
                          {selectedTemplate.fields.map((field) => (
                            <div key={field.name}>
                              <Label className="text-xs">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </Label>
                              {field.type === 'textarea' ? (
                                <Textarea
                                  value={templateData[field.name] || field.defaultValue || ''}
                                  onChange={(e) => handleTemplateDataChange(field.name, e.target.value)}
                                  placeholder={field.placeholder}
                                  rows={2}
                                  className="text-sm"
                                />
                              ) : (
                                <Input
                                  type={field.type}
                                  value={templateData[field.name] || field.defaultValue || ''}
                                  onChange={(e) => handleTemplateDataChange(field.name, e.target.value)}
                                  placeholder={field.placeholder}
                                  className="text-sm"
                                />
                              )}
                            </div>
                          ))}
                        </div>

                        <Button onClick={handleGenerateFromTemplate} className="w-full" variant="outline">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Apply Template
                        </Button>

                        {generatedCaption && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                            <Label className="text-xs font-semibold text-green-800">Generated Caption:</Label>
                            <p className="text-xs text-green-700 mt-1 whitespace-pre-line">{generatedCaption}</p>
                          </div>
                        )}
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Photo Input (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Upload Photo/Image</Label>
                  <p className="text-xs text-gray-500 mb-2">
                    All models accept photo input. DALL·E will composite after generation; Gemini & Runway use it during generation.
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProductFile(e.target.files?.[0] || null)}
                  />
                  {productFile && (
                    <div className="mt-2 text-xs text-green-600">
                      ✓ {productFile.name} ready
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="preserve"
                    checked={preserveProduct}
                    onChange={(e) => setPreserveProduct(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="preserve">Composite photo with generated image</Label>
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
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    <p className="text-sm text-gray-600 font-medium">{generatingStatus}</p>
                  </div>
                )}

                {!loading && results.length === 0 && (
                  <div className="text-center text-gray-500 py-12">
                    No images generated yet. Configure settings and click Generate.
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {results.map((asset, index) => (
                    <div
                      key={asset.id}
                      className="border rounded-lg overflow-hidden animate-in fade-in-50 duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="relative aspect-square bg-gray-100 group cursor-pointer hover:opacity-90 transition-opacity">
                        <img
                          src={asset.url.startsWith('http') ? asset.url : `${window.location.origin}${asset.url}`}
                          alt={asset.prompt}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDownload(asset.url, asset.filename)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="text-sm text-gray-600 line-clamp-2">{asset.prompt}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            className="flex-1"
                            onClick={() => handleDownload(asset.url, asset.filename)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Maximize2 className="w-4 h-4 mr-1" />
                                Resize
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {Object.entries(PLATFORM_PRESETS).map(([key, val]) => (
                                <DropdownMenuItem
                                  key={key}
                                  onClick={() => handleResize(asset.id, key)}
                                >
                                  {val.name} ({val.width}×{val.height})
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
