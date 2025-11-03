'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Copy, Wand2, Image as ImageIcon, Send } from 'lucide-react'

interface TemplateField {
  name: string
  type: string
  label: string
  placeholder?: string
  required?: boolean
}

interface Template {
  id: string
  name: string
  industry: string
  platform: string
  description: string
  fields: TemplateField[]
  category: string
  tags: string[]
}

export default function TemplatesPage() {
  const [industries, setIndustries] = useState<string[]>([])
  const [selectedIndustry, setSelectedIndustry] = useState<string>('')
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [generatedCaption, setGeneratedCaption] = useState<string>('')
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  // Load industries on mount
  useEffect(() => {
    fetch('/api/templates')
      .then((res) => res.json())
      .then((data) => {
        setIndustries(data.industries || [])
      })
      .catch((err) => console.error('Failed to load industries:', err))
  }, [])

  // Load templates when industry changes
  useEffect(() => {
    if (!selectedIndustry) return

    fetch(`/api/templates?industry=${selectedIndustry}`)
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data.templates || [])
      })
      .catch((err) => console.error('Failed to load templates:', err))
  }, [selectedIndustry])

  // Fill template
  const handleFillTemplate = async () => {
    if (!selectedTemplate) return

    setIsLoading(true)

    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'fill',
          templateId: selectedTemplate.id,
          data: formData,
          userId: 'demo-user-123',
        }),
      })

      const result = await res.json()

      if (result.success) {
        setGeneratedCaption(result.caption)
        setGeneratedPrompt(result.imagePrompt)
      } else {
        alert('Failed to generate content')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to generate content')
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-fill with AI
  const handleAutoFill = async () => {
    if (!selectedTemplate) return

    setIsLoading(true)

    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'autofill',
          templateId: selectedTemplate.id,
          data: formData,
        }),
      })

      const result = await res.json()

      if (result.success) {
        setFormData(result.data)
        alert(`AI filled ${result.aiSuggested?.length || 0} fields!`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('AI auto-fill failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Post Templates by Industry</h1>
        <p className="text-muted-foreground">
          Use pre-built templates to quickly create professional social media posts
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Template Selection */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Industry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose industry..." />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry.charAt(0).toUpperCase() + industry.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {templates.length > 0 && (
                <div className="space-y-2">
                  <Label>Available Templates</Label>
                  <div className="space-y-2">
                    {templates.map((template) => (
                      <Card
                        key={template.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTemplate?.id === template.id
                            ? 'ring-2 ring-primary'
                            : ''
                        }`}
                        onClick={() => {
                          setSelectedTemplate(template)
                          setFormData({})
                          setGeneratedCaption('')
                          setGeneratedPrompt('')
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="font-medium mb-1">{template.name}</div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {template.description}
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            <Badge variant="secondary" className="text-xs">
                              {template.platform}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {template.category}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Middle: Template Form */}
        <div className="lg:col-span-2 space-y-4">
          {selectedTemplate ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {selectedTemplate.name}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAutoFill}
                      disabled={isLoading}
                    >
                      <Wand2 className="h-4 w-4 mr-1" />
                      AI Auto-Fill
                    </Button>
                  </CardTitle>
                  <CardDescription>{selectedTemplate.description}</CardDescription>
                </CardHeader>
                  <CardContent className="space-y-4">
                  {/* Image Placeholder Swapper */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-3">Template Image Placeholder</p>
                    <p className="text-xs text-gray-500 mb-4">
                      This template uses image placeholders (e.g., car, logo) that can be swapped via AI prompt or photo upload
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Generate image from template prompt
                          const prompt = `Professional ${selectedTemplate.industry} ${selectedTemplate.name.toLowerCase()} image, ${Object.values(formData).join(', ')}`
                          window.location.href = `/studio/image?prompt=${encodeURIComponent(prompt)}`
                        }}
                      >
                        <ImageIcon className="w-4 h-4 mr-1" />
                        Generate Image
                      </Button>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="template-image-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            // Handle photo upload for template
                            const reader = new FileReader()
                            reader.onload = () => {
                              setFormData({ ...formData, imagePlaceholder: reader.result as string })
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('template-image-upload')?.click()}
                      >
                        Upload Photo
                      </Button>
                    </div>
                    {formData.imagePlaceholder && (
                      <div className="mt-4">
                        <img
                          src={formData.imagePlaceholder}
                          alt="Template placeholder"
                          className="max-w-full max-h-32 mx-auto rounded"
                        />
                      </div>
                    )}
                  </div>

                  {selectedTemplate.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label>
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </Label>
                      {field.type === 'textarea' ? (
                        <Textarea
                          placeholder={field.placeholder}
                          value={formData[field.name] || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, [field.name]: e.target.value })
                          }
                        />
                      ) : (
                        <Input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[field.name] || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, [field.name]: e.target.value })
                          }
                        />
                      )}
                    </div>
                  ))}

                  <Button
                    onClick={handleFillTemplate}
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isLoading ? 'Generating...' : 'Generate Post Content'}
                  </Button>
                </CardContent>
              </Card>

              {/* Generated Content */}
              {(generatedCaption || generatedPrompt) && (
                <Tabs defaultValue="caption" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="caption">Caption</TabsTrigger>
                    <TabsTrigger value="image">Image Prompt</TabsTrigger>
                  </TabsList>

                  <TabsContent value="caption">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          Generated Caption
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(generatedCaption)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="whitespace-pre-wrap p-4 bg-muted rounded-lg">
                          {generatedCaption}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" className="flex-1">
                            <ImageIcon className="h-4 w-4 mr-1" />
                            Generate Image
                          </Button>
                          <Button className="flex-1">
                            <Send className="h-4 w-4 mr-1" />
                            Schedule Post
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="image">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          AI Image Prompt
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(generatedPrompt)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                        </CardTitle>
                        <CardDescription>
                          Use this with DALL-E or Gemini to generate the perfect image
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4 bg-muted rounded-lg mb-4">
                          {generatedPrompt}
                        </div>
                        <Button className="w-full">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Generate Image Now
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Sparkles className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Select a Template</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Choose an industry and template from the left to get started with
                  AI-powered post creation
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
