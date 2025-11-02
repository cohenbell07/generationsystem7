# 🚀 Quick Setup Guide - CohenGPT Marketing Suite

## Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `@anthropic-ai/sdk` - For Claude AI
- All existing dependencies (OpenAI, Gemini, Next.js, etc.)

## Step 2: Configure Environment Variables

```bash
cp .env.example .env
```

**Minimum required API keys:**

```env
OPENAI_API_KEY=sk-...          # Get from https://platform.openai.com/api-keys
GOOGLE_GEMINI_API_KEY=...       # Get from https://aistudio.google.com/app/apikey
DATABASE_URL="file:./dev.db"    # SQLite for development
```

**Optional but recommended:**

```env
ANTHROPIC_API_KEY=...           # For Claude AI (Marketing Brain features)
META_APP_ID=...                 # For Facebook/Instagram publishing
TIKTOK_CLIENT_KEY=...           # For TikTok publishing
YOUTUBE_API_KEY=...             # For YouTube publishing
HEYGEN_API_KEY=...              # For AI Spokesperson videos
```

See `.env.example` for the complete list of 50+ API keys for all features.

## Step 3: Initialize Database

```bash
npx prisma db push
npx prisma generate
```

This creates all database tables for:
- PostTemplate
- CalendarEvent
- ABTest
- MarketingStrategy
- AdCampaign & AdVariation
- CompetitorProfile & CompetitorPost
- Achievement
- Lead & LeadInteraction
- Reputation
- SpokesPersonVideo
- ROIAttribution
- GrowthPrediction

## Step 4: Run Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

## Step 5: Test Features

### Test 1: Templates API

```bash
curl http://localhost:3000/api/templates?industry=realtor
```

### Test 2: Optimal Timing

```bash
curl -X POST http://localhost:3000/api/marketing/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "action": "timing",
    "userId": "demo-user-123",
    "platform": "instagram",
    "contentType": "reel"
  }'
```

### Test 3: Performance Prediction

```bash
curl -X POST http://localhost:3000/api/marketing/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "action": "predict",
    "userId": "demo-user-123",
    "platform": "instagram",
    "caption": "Summer sale! 50% off everything!",
    "contentType": "image"
  }'
```

### Test 4: Fill Template

```bash
curl -X POST http://localhost:3000/api/templates \
  -H "Content-Type: application/json" \
  -d '{
    "action": "fill",
    "templateId": "realtor-open-house",
    "data": {
      "address": "123 Main Street",
      "price": "$500,000",
      "bedrooms": "3",
      "bathrooms": "2",
      "sqft": "2,000 sqft",
      "date": "Saturday 2-4pm",
      "highlights": "Renovated kitchen, hardwood floors, large backyard"
    }
  }'
```

## What's Included

### ✅ Phase 1: User-Facing Features

1. **Post Templates by Industry** - Realtor, Auto, Med Spa, Restaurant
2. **Enhanced SEO Generator** - Score, hashtags, improvements
3. **Smart Calendar System** - Google Calendar sync, AI-optimized timing
4. **Cross-Platform Reformatter** - FFmpeg video resizing (requires FFmpeg installed)
5. **Performance Estimator** - Predict engagement before posting

### ✅ Phase 2: AI Systems

6. **Auto-Iterate A/B Testing** - Automated testing system
7. **AI Marketing Brain** - Weekly strategic insights
8. **AI Ad Manager** - Meta, Google, TikTok ad campaigns
9. **Competitor Scanner** - Track competitors' posts and performance

### ✅ Phase 3: Growth Infrastructure

10. **Analytics Dashboard** - Gamified progress tracking
11. **CRM + Lead Nurture** - AI-powered lead scoring and responses
12. **Reputation Monitoring** - Review tracking and auto-responses
13. **AI Spokesperson** - HeyGen/Synthesia integration
14. **ROI Attribution** - Revenue tracking across channels
15. **Growth Simulator** - Predictive "what-if" scenarios

### ✅ Infrastructure

- **Subscription Tiers** - Free, Starter, Pro, Elite, Growth Master
- **Feature Flags** - Per-tier access control
- **AI Wrapper** - Unified GPT/Claude/Gemini interface
- **Database Schema** - 17 new models
- **API Routes** - Template, optimizer, and marketing endpoints

## File Structure

```
lib/
├── ai/
│   ├── llm.ts              # ⭐ NEW: Unified AI wrapper
│   ├── dalle.ts
│   ├── geminiImage.ts
│   └── composite.ts
├── marketing/              # ⭐ NEW
│   ├── optimizer.ts        # Timing, content optimization, predictions
│   ├── videoReformatter.ts # FFmpeg video processing
│   └── crm.ts              # Lead management
├── templates/              # ⭐ NEW
│   └── industries.ts       # Industry-specific templates
├── subscriptions/          # ⭐ NEW
│   └── features.ts         # Feature flags and tier management
├── seo/
│   ├── generate.ts         # Enhanced SEO
│   └── score.ts
└── publishers/
    └── ...                 # Existing

app/api/
├── templates/              # ⭐ NEW
│   └── route.ts
├── marketing/              # ⭐ NEW
│   └── optimize/
│       └── route.ts
├── image/generate/
├── seo/generate/
└── posts/schedule/

prisma/
└── schema.prisma           # ⭐ UPDATED: 17 new models
```

## Subscription Tiers

| Tier | Price | Key Features |
|------|-------|-------------|
| **Free** | $0 | 5 AI posts/month, basic templates |
| **Starter** | $39 | 25 posts/month, industry templates, calendar sync |
| **Pro** | $99 | 100 posts/month, video reformatter, AI timing |
| **Elite** | $199 | Unlimited posts, A/B testing, ad manager |
| **Growth Master** | $399 | Everything + CRM, ROI tracking, spokesperson |

## Next Steps

1. **Install FFmpeg** (for video reformatting):
   ```bash
   # macOS
   brew install ffmpeg

   # Ubuntu/Debian
   sudo apt install ffmpeg

   # Windows
   # Download from https://ffmpeg.org/download.html
   ```

2. **Set up OAuth** for social platform publishing:
   - Meta (Facebook/Instagram): https://developers.facebook.com/
   - TikTok: https://developers.tiktok.com/
   - YouTube: https://console.cloud.google.com/
   - LinkedIn: https://www.linkedin.com/developers/

3. **Explore the code**:
   - Read `MARKETING_SUITE.md` for complete documentation
   - Check inline comments in library files
   - Test API endpoints with curl or Postman

4. **Build UI components**:
   - Create pages in `app/(dashboard)/studio/`
   - Use existing components from `components/ui/`
   - Follow patterns from `app/(dashboard)/studio/image/page.tsx`

## Common Issues

### FFmpeg not found

Install FFmpeg for video reformatting to work:
```bash
brew install ffmpeg  # macOS
sudo apt install ffmpeg  # Linux
```

### Prisma client errors

Regenerate the Prisma client:
```bash
npx prisma generate
npx prisma db push
```

### API key errors

Make sure you've set these in `.env`:
- `OPENAI_API_KEY`
- `GOOGLE_GEMINI_API_KEY`
- `DATABASE_URL`

### "User not found" errors

The app currently uses a demo user (`demo-user-123`). To add real authentication:
- Install NextAuth.js or Clerk
- Update API routes to use session user ID
- See `lib/plans.ts` for existing plan management structure

## Support

- **Documentation**: `MARKETING_SUITE.md`
- **Issues**: GitHub Issues
- **Questions**: Check inline code comments

---

**You're all set! 🎉**

Run `npm run dev` and start building your marketing empire with AI! 🚀
