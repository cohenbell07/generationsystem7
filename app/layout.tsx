import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { startScheduler } from '@/lib/jobs/scheduler'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Marketer - AI-Powered Marketing Tools',
  description: 'Generate stunning images, SEO-optimized content, and schedule posts across platforms',
}

// Start the job scheduler when the app starts
// In production, this would be a separate worker process
if (typeof window === 'undefined') {
  // Server-side only
  try {
    startScheduler()
  } catch (error) {
    console.error('Failed to start scheduler:', error)
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
