import Link from 'next/link'
import { Image, Zap, Calendar, BarChart, Video, Home } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <Link href="/">
            <h1 className="text-xl font-bold">CohenGPT</h1>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/studio/image"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Image className="w-5 h-5" />
            <span>Image Studio</span>
          </Link>

          <Link
            href="/studio/seo"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Zap className="w-5 h-5" />
            <span>SEO Studio</span>
          </Link>

          <Link
            href="/studio/scheduler"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Calendar className="w-5 h-5" />
            <span>Scheduler</span>
          </Link>

          <Link
            href="/studio/analytics"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <BarChart className="w-5 h-5" />
            <span>Analytics</span>
            <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              Pro
            </span>
          </Link>

          <Link
            href="/studio/video"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Video className="w-5 h-5" />
            <span>Video</span>
          </Link>

          <div className="pt-4 border-t mt-4">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t">
          <div className="text-xs text-gray-500">
            <p className="font-semibold">Demo User</p>
            <p>Bundle Plan</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
