/**
 * Next-Level Recommendations Dashboard
 * AI-powered tips and goals (e.g., "Add CTA at second 4")
 */

import { callGPTJSON } from '../ai/llm'
import { db } from '../db'

export interface Recommendation {
  id: string
  type:
    | 'content'
    | 'timing'
    | 'engagement'
    | 'growth'
    | 'conversion'
    | 'technical'
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  actionable: string // Specific action to take
  expectedImpact: string // e.g., "+15% engagement"
  timeToImplement: string // e.g., "5 minutes"
  difficulty: 'easy' | 'moderate' | 'advanced'
  category: string
  completed?: boolean
}

export interface GoalTracking {
  goal: string
  currentValue: number
  targetValue: number
  progress: number // 0-100
  deadline?: Date
  tips: string[]
  onTrack: boolean
}

/**
 * Generate personalized recommendations based on user's content
 */
export async function generateRecommendations(params: {
  userId: string
  contentAnalysis?: any
  recentPosts?: any[]
  goals?: string[]
}): Promise<Recommendation[]> {
  const { userId, goals = [] } = params

  // FALLBACK MODE - Return demo recommendations
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  Recommendations - using fallback suggestions')
    return [
      {
        id: '1',
        type: 'content',
        priority: 'high',
        title: '[DEMO] Add CTA at 4-second mark in videos',
        description:
          'Videos with early CTAs see 35% higher conversion rates. Add a visual CTA overlay at the 4-second mark when viewer attention peaks.',
        actionable:
          'In your next video, add text overlay: "Link in bio!" at the 4-second timestamp',
        expectedImpact: '+35% conversions',
        timeToImplement: '2 minutes per video',
        difficulty: 'easy',
        category: 'Video Optimization',
        completed: false,
      },
      {
        id: '2',
        type: 'timing',
        priority: 'medium',
        title: '[DEMO] Post on Tuesday at 7PM for peak engagement',
        description:
          'Your audience is most active on Tuesday evenings. Analytics show 45% higher engagement at this time.',
        actionable: 'Schedule your next post for Tuesday 7:00 PM',
        expectedImpact: '+45% engagement',
        timeToImplement: '1 minute',
        difficulty: 'easy',
        category: 'Posting Schedule',
        completed: false,
      },
      {
        id: '3',
        type: 'engagement',
        priority: 'high',
        title: '[DEMO] Respond to comments within 1 hour',
        description:
          'Fast responses boost algorithmic ranking. Posts with owner responses in the first hour get 2x more reach.',
        actionable: 'Set up notifications and respond to all comments within 60 minutes',
        expectedImpact: '2x organic reach',
        timeToImplement: 'Ongoing',
        difficulty: 'easy',
        category: 'Community Management',
        completed: false,
      },
      {
        id: '4',
        type: 'content',
        priority: 'medium',
        title: '[DEMO] Create carousel posts for 3x engagement',
        description:
          'Multi-slide carousels have 3x engagement vs. single images. Instagram\'s algorithm favors them.',
        actionable: 'Convert your next tip into a 5-slide carousel',
        expectedImpact: '+200% engagement',
        timeToImplement: '15 minutes',
        difficulty: 'moderate',
        category: 'Content Format',
        completed: false,
      },
      {
        id: '5',
        type: 'growth',
        priority: 'high',
        title: '[DEMO] Use 5-7 hashtags per post',
        description:
          'Your account performs best with 5-7 hashtags. More or fewer reduces reach.',
        actionable: 'Limit hashtags to 5-7 per post, mixing popular and niche tags',
        expectedImpact: '+25% reach',
        timeToImplement: '2 minutes',
        difficulty: 'easy',
        category: 'Hashtag Strategy',
        completed: false,
      },
      {
        id: '6',
        type: 'conversion',
        priority: 'critical',
        title: '[DEMO] Add link in bio CTA to every post',
        description:
          'Posts without CTA have 60% fewer click-throughs. Always guide users to next action.',
        actionable: 'Add "Link in bio 🔗" to end of every caption',
        expectedImpact: '+60% click-through',
        timeToImplement: '30 seconds',
        difficulty: 'easy',
        category: 'Conversion Optimization',
        completed: false,
      },
    ]
  }

  // Get user's recent posts
  const recentPosts = await db.postDraft.findMany({
    where: { userId },
    include: { metrics: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  const prompt = `Analyze this user's content and generate 5-10 personalized recommendations:

Recent Posts: ${recentPosts.length} posts
Goals: ${goals.join(', ')}

Performance Summary:
${JSON.stringify(
  recentPosts.slice(0, 5).map((p) => ({
    platform: p.platform,
    contentType: p.contentType,
    caption: p.caption?.substring(0, 50),
    metrics: p.metrics[0],
  })),
  null,
  2
)}

Generate specific, actionable recommendations. For each:
- type: "content"|"timing"|"engagement"|"growth"|"conversion"|"technical"
- priority: "low"|"medium"|"high"|"critical"
- title: Specific, compelling title
- description: Why this matters
- actionable: Exact steps to take
- expectedImpact: Quantified result (e.g., "+25% engagement")
- timeToImplement: How long it takes
- difficulty: "easy"|"moderate"|"advanced"
- category: Categorize the recommendation

Return as JSON array matching Recommendation interface (without id and completed fields).`

  try {
    const recommendations = await callGPTJSON<Omit<Recommendation, 'id' | 'completed'>[]>(
      prompt,
      'You are a social media growth strategist providing data-driven recommendations.'
    )

    return recommendations.map((rec, i) => ({
      ...rec,
      id: `rec-${Date.now()}-${i}`,
      completed: false,
    }))
  } catch (error) {
    console.error('[Recommendations] Generation failed:', error)
    return []
  }
}

/**
 * Track progress toward goals
 */
export async function trackGoals(params: {
  userId: string
  goals: Array<{
    goal: string
    targetValue: number
    metric: string
    deadline?: Date
  }>
}): Promise<GoalTracking[]> {
  const { userId, goals } = params

  // FALLBACK MODE
  if (!process.env.OPENAI_API_KEY) {
    return goals.map((g) => ({
      goal: g.goal,
      currentValue: g.targetValue * 0.65, // 65% progress
      targetValue: g.targetValue,
      progress: 65,
      deadline: g.deadline,
      tips: [
        '[DEMO] Post consistently 5x per week',
        '[DEMO] Use video content more frequently',
        '[DEMO] Engage with community daily',
      ],
      onTrack: true,
    }))
  }

  const results: GoalTracking[] = []

  for (const goal of goals) {
    // Get current metric value from database
    let currentValue = 0

    if (goal.metric === 'followers') {
      // In real app, fetch from social platform APIs
      currentValue = Math.floor(goal.targetValue * 0.7)
    } else if (goal.metric === 'engagement') {
      const recentPosts = await db.postDraft.findMany({
        where: { userId },
        include: { metrics: true },
        take: 10,
      })
      currentValue =
        recentPosts.reduce((sum, p) => {
          const latestMetric = p.metrics[0]
          return sum + (latestMetric?.engagement || 0)
        }, 0) / (recentPosts.length || 1)
    }

    const progress = Math.min(100, (currentValue / goal.targetValue) * 100)

    // Generate tips
    const prompt = `User goal: "${goal.goal}"
Current: ${currentValue}
Target: ${goal.targetValue}
Progress: ${progress.toFixed(1)}%

Give 3 specific tips to reach this goal faster.`

    let tips: string[] = []
    try {
      const response = await callGPTJSON<{ tips: string[] }>(
        prompt,
        'You are a goal achievement coach.'
      )
      tips = response.tips
    } catch {
      tips = ['Stay consistent', 'Track progress weekly', 'Adjust strategy as needed']
    }

    results.push({
      goal: goal.goal,
      currentValue,
      targetValue: goal.targetValue,
      progress: Math.round(progress),
      deadline: goal.deadline,
      tips,
      onTrack: progress >= 50, // On track if >= 50% progress
    })
  }

  return results
}

/**
 * Get quick wins - easy recommendations with high impact
 */
export async function getQuickWins(userId: string): Promise<Recommendation[]> {
  const allRecommendations = await generateRecommendations({ userId })

  // Filter for easy, high-priority recommendations
  return allRecommendations
    .filter(
      (rec) =>
        rec.difficulty === 'easy' &&
        (rec.priority === 'high' || rec.priority === 'critical')
    )
    .slice(0, 3)
}
