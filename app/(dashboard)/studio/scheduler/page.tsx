'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Calendar, Clock } from 'lucide-react'

export default function SchedulerPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
          <h1 className="text-3xl font-bold">Post Scheduler</h1>
          <Button>New Post</Button>
        </div>

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
