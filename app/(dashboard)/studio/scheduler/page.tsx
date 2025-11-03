'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { Calendar, Clock, Plus, Zap } from 'lucide-react'

export default function SchedulerPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewPost, setShowNewPost] = useState(false)
  const [autoPostEnabled, setAutoPostEnabled] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts/schedule')
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Post Scheduler</h1>
            <p className="text-gray-600 mt-1">Schedule posts manually or enable smart auto-posting</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setAutoPostEnabled(!autoPostEnabled)}>
              <Zap className="w-4 h-4 mr-2" />
              {autoPostEnabled ? 'Disable' : 'Enable'} Auto-Post
            </Button>
            <Button onClick={() => setShowNewPost(!showNewPost)}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {autoPostEnabled && (
          <Card className="mb-6 border-2 border-purple-200 bg-purple-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Smart Auto-Posting Enabled</h3>
                  <p className="text-sm text-gray-600">
                    Posts will be automatically published at optimal times based on your audience engagement patterns.
                  </p>
                </div>
                <Badge variant="secondary" className="bg-purple-600 text-white">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {showNewPost && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Schedule New Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Platform</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Schedule Date & Time</Label>
                  <Input type="datetime-local" />
                </div>
              </div>
              <div>
                <Label>Caption</Label>
                <Textarea placeholder="Enter post caption..." rows={4} />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowNewPost(false)}>Cancel</Button>
                <Button>Schedule Post</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading && (
          <div className="text-center py-12 text-gray-500">Loading posts...</div>
        )}

        {!loading && posts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12 text-gray-500">
              No posts yet. Create images and SEO content, then schedule them here.
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{post.platform}</CardTitle>
                  <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {post.asset && (
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={post.asset.url}
                      alt="Post image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <p className="text-sm text-gray-700 mb-4 line-clamp-3">{post.caption}</p>

                {post.scheduledAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(post.scheduledAt), 'MMM d, yyyy')}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{format(new Date(post.scheduledAt), 'h:mm a')}</span>
                  </div>
                )}

                {post.publishedAt && (
                  <div className="mt-2 text-sm text-green-600">
                    Published {format(new Date(post.publishedAt), 'MMM d, h:mm a')}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
