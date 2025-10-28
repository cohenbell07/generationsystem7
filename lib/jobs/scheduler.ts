import cron from 'node-cron'
import { prisma } from '../db'
import { getPublisher } from '../publishers'

/**
 * Job Scheduler using node-cron
 *
 * Checks for scheduled posts every minute and publishes them when due.
 *
 * TODO: For production, replace with a proper queue system:
 * - Bull/BullMQ with Redis
 * - AWS SQS + Lambda
 * - Inngest
 * - Trigger.dev
 */

let isSchedulerRunning = false

/**
 * Start the job scheduler
 */
export function startScheduler() {
  if (isSchedulerRunning) {
    console.log('⏰ Scheduler already running')
    return
  }

  console.log('🚀 Starting job scheduler...')

  // Run every minute
  cron.schedule('* * * * *', async () => {
    await processScheduledPosts()
  })

  isSchedulerRunning = true
  console.log('✅ Scheduler started (checks every minute)')
}

/**
 * Process all scheduled posts that are due
 */
async function processScheduledPosts() {
  try {
    const now = new Date()

    // Find all scheduled posts that are due
    const duePosts = await prisma.postDraft.findMany({
      where: {
        status: 'scheduled',
        scheduledAt: {
          lte: now,
        },
      },
      include: {
        asset: true,
        user: true,
      },
    })

    if (duePosts.length === 0) {
      return // No posts due
    }

    console.log(`\n⏰ Processing ${duePosts.length} scheduled post(s)...`)

    for (const post of duePosts) {
      await publishPost(post)
    }
  } catch (error: any) {
    console.error('❌ Scheduler error:', error.message)
  }
}

/**
 * Publish a single post
 */
async function publishPost(post: any) {
  console.log(`\n📤 Publishing post ${post.id} to ${post.platform}...`)

  try {
    const publisher = getPublisher(post.platform)
    if (!publisher) {
      throw new Error(`No publisher found for platform: ${post.platform}`)
    }

    // Get account connection for this platform
    const connection = await prisma.accountConnection.findFirst({
      where: {
        userId: post.userId,
        platform: post.platform,
        isActive: true,
      },
    })

    // In dev mode, we simulate the publish
    const accessToken = connection?.accessToken || ''

    const result = await publisher.publish(
      {
        id: post.id,
        platform: post.platform,
        caption: post.caption,
        tags: post.tags,
        asset: post.asset
          ? {
              url: post.asset.url,
              filename: post.asset.filename,
            }
          : undefined,
      },
      accessToken
    )

    if (result.success) {
      // Update post status
      await prisma.postDraft.update({
        where: { id: post.id },
        data: {
          status: 'published',
          publishedAt: new Date(),
        },
      })

      console.log(`✅ Post published successfully`)
      console.log(`   Platform Post ID: ${result.platformPostId}`)
      console.log(`   URL: ${result.publishedUrl}`)

      // Create initial metrics (mocked)
      await prisma.metric.create({
        data: {
          postId: post.id,
          impressions: 0,
          clicks: 0,
          engagement: 0,
        },
      })
    } else {
      // Mark as failed
      await prisma.postDraft.update({
        where: { id: post.id },
        data: {
          status: 'failed',
        },
      })

      console.error(`❌ Post failed to publish: ${result.error}`)
    }
  } catch (error: any) {
    console.error(`❌ Error publishing post: ${error.message}`)

    // Mark as failed
    await prisma.postDraft.update({
      where: { id: post.id },
      data: {
        status: 'failed',
      },
    })
  }
}

/**
 * Stop the scheduler (cleanup)
 */
export function stopScheduler() {
  if (!isSchedulerRunning) {
    return
  }

  console.log('🛑 Stopping scheduler...')
  isSchedulerRunning = false
}

/**
 * TODO: Production Queue System
 *
 * For production, replace this with a proper queue:
 *
 * Option 1: Bull/BullMQ with Redis
 * ================================
 * 1. Install: npm install bull redis
 * 2. Set up Redis instance
 * 3. Create queue:
 *
 *    import Queue from 'bull'
 *
 *    const publishQueue = new Queue('post-publishing', {
 *      redis: { host: 'localhost', port: 6379 }
 *    })
 *
 *    publishQueue.process(async (job) => {
 *      await publishPost(job.data.post)
 *    })
 *
 * 4. Add jobs with delay:
 *
 *    await publishQueue.add(
 *      { post },
 *      { delay: scheduledAt.getTime() - Date.now() }
 *    )
 *
 * Option 2: AWS SQS + Lambda
 * ==========================
 * 1. Create SQS queue with delay delivery
 * 2. Send message when post is scheduled
 * 3. Lambda function processes messages
 *
 * Option 3: Inngest (https://inngest.com)
 * ========================================
 * 1. Install: npm install inngest
 * 2. Define function with sleep:
 *
 *    inngest.createFunction(
 *      { name: "Publish post" },
 *      { event: "post.scheduled" },
 *      async ({ event, step }) => {
 *        await step.sleepUntil("wait-for-schedule", event.data.scheduledAt)
 *        await step.run("publish", () => publishPost(event.data.post))
 *      }
 *    )
 */
