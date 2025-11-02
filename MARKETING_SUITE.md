# 🚀 CohenGPT Marketing Suite

**Complete AI-Powered Marketing Automation Platform**

Version: 1.0.0
Last Updated: 2025-11-02

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features by Tier](#features-by-tier)
3. [Installation & Setup](#installation--setup)
4. [Phase 1: User-Facing Features](#phase-1-user-facing-features)
5. [Phase 2: AI Systems](#phase-2-ai-systems)
6. [Phase 3: Growth Infrastructure](#phase-3-growth-infrastructure)
7. [API Reference](#api-reference)
8. [Database Schema](#database-schema)
9. [Configuration](#configuration)
10. [Development Guide](#development-guide)

---

## 🎯 Overview

The CohenGPT Marketing Suite is a comprehensive AI-powered marketing platform that combines:

- **15+ Advanced Features** across content creation, optimization, and analytics
- **Multi-Platform Support** (Instagram, TikTok, YouTube, Facebook, LinkedIn, Pinterest)
- **AI-Powered Intelligence** (GPT-4, Claude, Gemini)
- **Complete CRM** with lead scoring and automated nurturing
- **ROI Tracking** and attribution across channels
- **Automated A/B Testing** and performance optimization

### Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS, Radix UI
- **Backend**: Next.js API Routes, Node.js
- **Database**: Prisma ORM (SQLite dev, PostgreSQL production)
- **AI**: OpenAI GPT-4, Anthropic Claude, Google Gemini
- **Media**: FFmpeg (video processing), Sharp (image processing)
- **Scheduling**: Node-cron, Google Calendar API
- **Publishing**: Meta, TikTok, YouTube, LinkedIn, Pinterest APIs

---

## 💳 Features by Tier

### Free ($0/month)
- ✅ 5 AI-generated posts/month
- ✅ Basic post templates
- ✅ Manual post scheduling
- ✅ Basic SEO scoring
- ✅ 2 social platforms

### Starter ($39/month)
- ✅ **Everything in Free, plus:**
- ✅ 25 AI posts/month
- ✅ Industry-specific templates (Realtor, Auto, Med Spa, Restaurant)
- ✅ Enhanced SEO with hashtag optimization
- ✅ Google Calendar sync
- ✅ Post performance estimator
- ✅ 4 social platforms
- ✅ 1 competitor profile tracking

### Pro ($99/month)
- ✅ **Everything in Starter, plus:**
- ✅ 100 AI posts/month
- ✅ Cross-platform video reformatter
- ✅ AI-optimized posting times
- ✅ Auto-post scheduling
- ✅ Advanced analytics dashboard
- ✅ 6 social platforms
- ✅ 3 competitor profiles
- ✅ 2 ad campaigns
- ✅ 2 AI spokesperson videos/month

### Elite ($199/month)
- ✅ **Everything in Pro, plus:**
- ✅ Unlimited AI posts
- ✅ Auto-iterate A/B testing (10 tests)
- ✅ AI Marketing Brain (weekly strategy)
- ✅ Ad campaign manager (10 campaigns)
- ✅ Competitor intelligence (5 profiles)
- ✅ 10 AI spokesperson videos/month
- ✅ 10 social platforms

### Growth Master ($399/month)
- ✅ **Everything in Elite, plus:**
- ✅ Full CRM + AI lead nurturing (unlimited leads)
- ✅ 25 AI spokesperson videos/month
- ✅ ROI attribution engine
- ✅ Reputation monitoring & auto-response
- ✅ Growth simulator
- ✅ 20 competitor profiles
- ✅ Unlimited platforms, posts, and campaigns
- ✅ Priority support

---

## 🛠 Installation & Setup

### Prerequisites

```bash
Node.js >= 18.x
npm or yarn
SQLite (dev) or PostgreSQL (production)
FFmpeg (for video processing)
```

### Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd generationsystem7

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env and add your API keys (see Configuration section)

# Initialize database
npx prisma db push

# Run development server
npm run dev

# Visit http://localhost:3000
```

### Required API Keys

**Minimum Required (Core Features):**
- `OPENAI_API_KEY` - For GPT-4 and DALL-E
- `GOOGLE_GEMINI_API_KEY` - For Gemini AI
- `DATABASE_URL` - Database connection

**Recommended (Full Features):**
- `ANTHROPIC_API_KEY` - For Claude AI (Marketing Brain)
- `META_APP_ID` + `META_APP_SECRET` - Facebook/Instagram
- `TIKTOK_CLIENT_KEY` + `TIKTOK_CLIENT_SECRET` - TikTok
- `YOUTUBE_API_KEY` - YouTube publishing
- `GOOGLE_CALENDAR_API_KEY` - Calendar integration
- `HEYGEN_API_KEY` - AI Spokesperson videos

See `.env.example` for complete list.

---

## 📊 Phase 1: User-Facing Features

### 1. 🎯 Post Templates by Industry

**Location**: `/lib/templates/industries.ts`

Pre-built templates for common business verticals:

- **Real Estate**: Open House, Just Listed, Sold
- **Automotive**: New Arrival, Special Financing
- **Med Spa**: Treatment Promo, Before/After
- **Restaurant**: Daily Special, Events

**Usage:**

```typescript
import { getTemplatesByIndustry, fillTemplate } from '@/lib/templates/industries'

// Get realtor templates
const templates = getTemplatesByIndustry('realtor')

// Fill template with data
const { caption, imagePrompt } = fillTemplate(templates[0], {
  address: '123 Main St',
  price: '$500,000',
  bedrooms: '3',
  bathrooms: '2',
})
```

**API Endpoint:**

```http
GET /api/templates?industry=realtor
POST /api/templates
{
  "action": "fill",
  "templateId": "realtor-open-house",
  "data": { "address": "123 Main St", ... }
}
```

### 2. 📈 Enhanced SEO Generator + Ranker

**Location**: `/lib/seo/` (enhanced), `/app/api/seo/generate/route.ts`

**Features:**
- SEO scoring (0-100) with breakdown
- Platform-aware hashtag generation
- Keyword optimization
- Improvement suggestions
- Real-time trend integration (optional)

**Supported Platforms:**
- YouTube, Instagram, TikTok, Facebook, LinkedIn, Pinterest, X (Twitter), Website/Blog

**Usage:**

```typescript
import { generateSEOContent, scoreSEO } from '@/lib/seo/generate'

const content = await generateSEOContent({
  platform: 'instagram',
  topic: 'Summer fashion trends',
  tone: 'playful',
})

// Returns: { title, description, tags, caption, score, reasons, improvements }
```

### 3. 📅 Smart Social Calendar System

**Location**: `/lib/marketing/optimizer.ts`, Database: `CalendarEvent` model

**Features:**
- Google Calendar integration
- Manual scheduling
- AI-optimized timing (analyzes historical performance)
- Multi-platform scheduling
- Conflict detection

**API Endpoint:**

```http
POST /api/marketing/optimize
{
  "action": "timing",
  "userId": "user-123",
  "platform": "instagram",
  "contentType": "reel"
}

# Returns top 5 optimal posting times with confidence scores
```

**Database Model:**

```prisma
model CalendarEvent {
  id            String @id
  userId        String
  postId        String?
  title         String
  startTime     DateTime
  googleEventId String?
  isAIOptimized Boolean
  aiReasoning   String?
}
```

### 4. 🔁 Cross-Platform Auto Reformatter

**Location**: `/lib/marketing/videoReformatter.ts`

Automatically resizes and optimizes videos for each platform using FFmpeg.

**Supported Formats:**
- TikTok (1080x1920, 9:16, 3 min max)
- Instagram Reels (1080x1920, 9:16, 90s max)
- Instagram Feed (1080x1080, 1:1, 60s max)
- YouTube Shorts (1080x1920, 9:16, 60s max)
- YouTube Standard (1920x1080, 16:9)
- Facebook Feed/Story
- LinkedIn

**Usage:**

```typescript
import { reformatVideo, generatePlatformContent } from '@/lib/marketing/videoReformatter'

// Reformat single video for TikTok
const result = await reformatVideo('/path/to/video.mp4', 'tiktok')

// Generate optimized captions for each platform
const content = await generatePlatformContent({
  originalCaption: 'Check out my new product!',
  platforms: ['tiktok', 'instagram-reel', 'youtube-short'],
  topic: 'Product launch',
})
```

### 5. 🔮 Predictive Post Performance Estimator

**Location**: `/lib/marketing/optimizer.ts`

AI predicts performance before posting based on historical data.

**Metrics Predicted:**
- Impression range (min/max)
- Engagement rate range
- Conversion score (1-10)
- Confidence level (0-1)

**API Endpoint:**

```http
POST /api/marketing/optimize
{
  "action": "predict",
  "userId": "user-123",
  "platform": "instagram",
  "caption": "Summer sale! 50% off...",
  "contentType": "image"
}
```

---

## 🤖 Phase 2: AI Systems

### 6. 🔄 Auto-Iterate Post System

**Location**: Database: `ABTest` model

Weekly automated A/B testing of:
- Captions
- Thumbnails
- Hashtags
- Posting times

**Database Model:**

```prisma
model ABTest {
  id         String @id
  userId     String
  name       String
  testType   String // "caption", "thumbnail", "hashtags", "timing"
  variantA   String // JSON
  variantB   String // JSON
  winner     String? // "A", "B", or null
  confidence Float?
  insights   String? // AI learnings
}
```

**Automated Process:**
1. System creates test variants
2. Posts both variants at optimal times
3. Tracks engagement for 7 days
4. AI analyzes results and declares winner
5. Stores insights in database
6. Applies learnings to future posts

### 7. 🧠 AI Marketing Brain

**Location**: `/lib/marketing/optimizer.ts`, Database: `MarketingStrategy` model

**Weekly Strategic Analysis:**
- Analyzes all user posts from past week
- Identifies top-performing content styles
- Detects content gaps
- Recommends optimal posting times
- Provides priority action items

**Database Model:**

```prisma
model MarketingStrategy {
  id                  String @id
  userId              String
  weekNumber          Int
  year                Int
  topPerformingStyle  String?
  bestPostingTimes    String? // JSON array
  contentGaps         String? // JSON array
  recommendations     String  // JSON array
  priorityScore       Float
  weekOverWeekGrowth  Float?
}
```

**Usage:**

```typescript
import { generateMarketingStrategy } from '@/lib/ai/llm'

const strategy = await generateMarketingStrategy({
  industry: 'realtor',
  currentMetrics: { posts: 20, avgEngagement: 3.5 },
  goals: ['increase engagement', 'generate leads'],
})
```

### 8. 📢 AI Ad Manager

**Location**: Database: `AdCampaign`, `AdVariation` models

**Features:**
- Connect Meta Ads, Google Ads, TikTok Ads
- Auto-generate ad copy variations
- AI writes headlines, descriptions, CTAs
- Budget recommendations
- Performance tracking

**Supported Platforms:**
- Meta Ads (Facebook & Instagram)
- Google Ads
- TikTok Ads

**Database Models:**

```prisma
model AdCampaign {
  id                 String @id
  name               String
  platform           String
  objective          String
  budget             Float
  status             String
  platformCampaignId String?
  variations         AdVariation[]
}

model AdVariation {
  headline     String
  primaryText  String
  callToAction String?
  impressions  Int
  clicks       Int
  conversions  Int
}
```

### 9. 🔍 Competitor Intelligence Scanner

**Location**: Database: `CompetitorProfile`, `CompetitorPost` models

**Features:**
- Track up to 20 competitor profiles (Growth Master tier)
- Scrape posts, engagement, follower growth
- Analyze content types, hashtags, posting frequency
- Side-by-side comparison
- AI trend detection

**Database Models:**

```prisma
model CompetitorProfile {
  id            String @id
  userId        String
  platform      String
  handle        String
  followers     Int
  avgEngagement Float
  postFrequency Float
  topContentTypes String? // JSON
  posts         CompetitorPost[]
}

model CompetitorPost {
  platformPostId String
  contentType    String
  caption        String?
  likes          Int
  comments       Int
  postedAt       DateTime
}
```

**Data Sources:**
- Official platform APIs (where available)
- APIFY, Phantombuster, or similar scraping services
- Manual CSV import

---

## 📊 Phase 3: Growth Infrastructure

### 10. 📈 Next-Level Analytics Dashboard

**Location**: Database: `Achievement` model

**Gamified Progress Tracking:**
- Achievement system (Novice → Pro → Expert → Master)
- Progress bars and milestones
- KPI recommendations
- Performance trends
- Goal setting

**Achievement Types:**
- Posts published
- Engagement rate milestones
- Follower growth
- Conversion achievements
- Consistency streaks

### 11. 🧲 CRM + AI Lead Nurture

**Location**: `/lib/marketing/crm.ts`, Database: `Lead`, `LeadInteraction` models

**Features:**
- Lead capture from social DMs, comments, website forms
- AI lead scoring (0-100)
- Automated response generation
- Sentiment analysis
- Follow-up scheduling
- Nurture campaigns

**Lead Scoring Factors:**

```typescript
{
  source: 0-25 points,      // website_form = 25, tiktok_comment = 10
  engagement: 0-25 points,  // based on interaction count
  timing: 0-25 points,      // response speed
  intent: 0-25 points       // AI analyzes message content
}
```

**Usage:**

```typescript
import { scoreLead, generateLeadResponse, upsertLead } from '@/lib/marketing/crm'

// Score a new lead
const { score, factors } = await scoreLead({
  source: 'instagram_dm',
  message: 'How much is your service?',
})

// Generate AI response
const response = await generateLeadResponse({
  leadMessage: 'How much is your service?',
  businessContext: 'Med spa offering facials',
  responseGoal: 'book_appointment',
})
```

### 12. 💬 Reputation Monitoring + Response

**Location**: Database: `Reputation` model

**Monitors:**
- Google Reviews
- Facebook reviews
- Instagram comments/mentions
- TikTok comments
- Twitter mentions

**AI Features:**
- Sentiment detection (positive/neutral/negative)
- Auto-draft responses
- Alert on negative reviews
- Response templates

### 13. 🎤 AI Spokesperson Engine

**Location**: Database: `SpokesPersonVideo` model

**Integrations:**
- HeyGen API
- Synthesia API

**Features:**
- AI generates video script
- Select avatar and voice
- Generate branded spokesperson videos
- Download and publish

**Usage Limits:**
- Pro: 2 videos/month
- Elite: 10 videos/month
- Growth Master: 25 videos/month

### 14. 💰 ROI Attribution Engine

**Location**: Database: `ROIAttribution` model

**Tracks Revenue From:**
- Instagram posts
- Facebook ads
- TikTok videos
- YouTube videos
- LinkedIn posts

**Integrations:**
- Google Analytics 4
- Shopify
- Meta Pixel
- Custom UTM tracking

**Database Model:**

```prisma
model ROIAttribution {
  source      String // "instagram_post", "facebook_ad"
  clicks      Int
  conversions Int
  revenue     Float
  utmSource   String?
  utmCampaign String?
  trackingDate DateTime
}
```

### 15. 📆 Predictive Growth Simulator

**Location**: Database: `GrowthPrediction` model

**Simulates:**
- "What if I post 3× more?"
- "What if I add video content?"
- "What if I increase ad budget?"

**AI Predictions:**
- Engagement rate changes
- Follower growth
- Revenue impact
- Confidence levels

**Database Model:**

```prisma
model GrowthPrediction {
  scenario                String
  currentPostFrequency    Float
  predictedPostFrequency  Float
  currentEngagementRate   Float
  predictedEngagementRate Float
  predictedRevenue        Float?
  confidence              Float
  methodology             String?
}
```

---

## 🔌 API Reference

### Templates

```http
GET  /api/templates?industry=realtor
POST /api/templates
```

### Marketing Optimization

```http
POST /api/marketing/optimize
{
  "action": "timing" | "content" | "predict",
  "userId": "string",
  // ... action-specific params
}
```

### Image Generation (Existing)

```http
POST /api/image/generate
```

### SEO Generation (Enhanced)

```http
POST /api/seo/generate
```

### Post Scheduling (Existing)

```http
POST /api/posts/schedule
GET  /api/posts/schedule?userId=123
```

---

## 🗄 Database Schema

### New Tables

- `PostTemplate` - Industry templates
- `CalendarEvent` - Calendar sync & scheduling
- `ABTest` - A/B test tracking
- `MarketingStrategy` - Weekly AI insights
- `AdCampaign` & `AdVariation` - Ad management
- `CompetitorProfile` & `CompetitorPost` - Competitor tracking
- `Achievement` - Gamification
- `Lead` & `LeadInteraction` - CRM
- `Reputation` - Review monitoring
- `SpokesPersonVideo` - AI videos
- `ROIAttribution` - Revenue tracking
- `GrowthPrediction` - Simulations

### Run Migrations

```bash
npx prisma db push
npx prisma generate
```

---

## ⚙️ Configuration

### Feature Flags

```typescript
import { hasFeatureAccess, checkLimit } from '@/lib/subscriptions/features'

// Check if user has access
if (hasFeatureAccess(userTier, Feature.AI_SPOKESPERSON)) {
  // Allow feature
}

// Check usage limits
const { allowed, remaining } = checkLimit(userTier, 'spokespersonVideos', currentUsage)
```

### Environment Variables

See `.env.example` for complete reference. Required variables:

```env
# Minimum
OPENAI_API_KEY=sk-...
GOOGLE_GEMINI_API_KEY=...
DATABASE_URL="file:./dev.db"

# Recommended
ANTHROPIC_API_KEY=...
META_APP_ID=...
GOOGLE_CALENDAR_API_KEY=...
```

---

## 🛠 Development Guide

### Project Structure

```
/lib
  /ai
    llm.ts              # Unified AI wrapper (GPT, Claude, Gemini)
    dalle.ts            # Existing DALL-E integration
    geminiImage.ts      # Existing Gemini integration
  /marketing
    optimizer.ts        # Post timing, content optimization
    videoReformatter.ts # FFmpeg video processing
    crm.ts              # Lead management
  /templates
    industries.ts       # Industry-specific templates
  /subscriptions
    features.ts         # Feature flags & tier management
  /seo
    generate.ts         # Enhanced SEO generation
    score.ts            # SEO scoring algorithm

/app/api
  /templates          # Template APIs
  /marketing/optimize # Optimization APIs
  /seo/generate       # SEO APIs (enhanced)
  /image/generate     # Image generation (existing)
  /posts/schedule     # Scheduling (existing)

/prisma
  schema.prisma       # Database schema (extended)
```

### Adding a New Feature

1. **Create library function** in `/lib/marketing/yourFeature.ts`
2. **Add database models** to `prisma/schema.prisma`
3. **Run migration**: `npx prisma db push`
4. **Create API route** in `/app/api/yourFeature/route.ts`
5. **Add feature flag** to `/lib/subscriptions/features.ts`
6. **Create UI component** in `/app/(dashboard)/studio/yourFeature/page.tsx`

### Testing

```bash
# Run development server
npm run dev

# Test API endpoints
curl -X POST http://localhost:3000/api/templates \
  -H "Content-Type: application/json" \
  -d '{"templateId": "realtor-open-house", "action": "fill", "data": {...}}'

# Check database
npx prisma studio
```

---

## 📞 Support

**Documentation**: This file + inline code comments
**Issues**: GitHub Issues
**Feature Requests**: GitHub Discussions

---

## 📄 License

Proprietary - CohenGPT Marketing Suite

---

## 🎉 Quick Start Checklist

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Add `OPENAI_API_KEY` and `GOOGLE_GEMINI_API_KEY`
- [ ] Run `npx prisma db push`
- [ ] Run `npm run dev`
- [ ] Visit `http://localhost:3000`
- [ ] Test template system: `/studio/templates` (you may need to create this page)
- [ ] Test optimizer: POST to `/api/marketing/optimize`

**You're ready to go! 🚀**
