# Setup Guide

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your API keys
# At minimum, add OPENAI_API_KEY for the app to work
```

### 3. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Create database and tables
npx prisma db push

# Seed with demo data
npm run db:seed
```

### 4. Run the App

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## What You'll See

- **Home Page** (`/`): Marketing site with feature overview
- **Image Studio** (`/studio/image`): Generate AI images with DALL·E or Gemini
- **SEO Studio** (`/studio/seo`): Create platform-optimized SEO content
- **Scheduler** (`/studio/scheduler`): View and manage scheduled posts
- **Analytics** (`/studio/analytics`): Pro feature upgrade prompt
- **Video** (`/studio/video`): Manual service request form

## Demo Data

The seed script creates:
- 1 demo user with Bundle plan
- 2 sample generated images
- 2 SEO presets (YouTube & Instagram)
- 2 scheduled posts (will publish within 5 minutes)

## Testing Features

### Test Image Generation
1. Go to `/studio/image`
2. Choose DALL·E or Gemini
3. Enter a prompt (e.g., "Luxury perfume bottle on marble surface")
4. Select a platform preset
5. Click "Generate Images"

**Note**: Requires `OPENAI_API_KEY` in `.env`

### Test SEO Generation
1. Go to `/studio/seo`
2. Select a platform (e.g., YouTube)
3. Enter a topic (e.g., "Morning skincare routine")
4. Choose a tone
5. Click "Generate SEO Content"
6. View the SEO Score and improvements

### Test Scheduler
1. Go to `/studio/scheduler`
2. View the seeded scheduled posts
3. Watch the console - posts will auto-publish when their time comes
4. The scheduler runs every minute via node-cron

## Troubleshooting

### "OpenAI API key not set"
Add your API key to `.env`:
```env
OPENAI_API_KEY=sk-...
```

### "Prisma client not generated"
Run:
```bash
npx prisma generate
```

### Port 3000 in use
Use a different port:
```bash
PORT=3001 npm run dev
```

### Images not uploading
Ensure uploads directory exists:
```bash
mkdir -p uploads/images uploads/products uploads/backgrounds
```

### Database issues
Reset the database:
```bash
rm prisma/dev.db
npx prisma db push
npm run db:seed
```

## Next Steps

1. **Add API Keys**: Get OpenAI and Google Gemini keys
2. **Customize Branding**: Edit marketing pages
3. **Configure Plans**: Adjust pricing in `lib/plans.ts`
4. **Deploy**: Follow README deployment guide
5. **Integrate Publishers**: Add real social media API connections

## Getting API Keys

### OpenAI (Required)
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account
3. Navigate to API Keys
4. Create new key
5. Add to `.env` as `OPENAI_API_KEY`

### Google Gemini (Optional)
1. Go to [makersuite.google.com](https://makersuite.google.com)
2. Get API key
3. Add to `.env` as `GOOGLE_GEMINI_API_KEY`

**Note**: Gemini Image currently uses a development stub. For production, integrate Vertex AI Imagen (see `lib/ai/geminiImage.ts`).

## Production Checklist

Before deploying to production:

- [ ] Add all required API keys
- [ ] Switch to PostgreSQL (see README)
- [ ] Set up S3 or cloud storage (see README)
- [ ] Replace node-cron with Bull/BullMQ (see README)
- [ ] Integrate real social media APIs (see `lib/publishers/`)
- [ ] Add authentication (currently demo mode)
- [ ] Set up payment processing for plans
- [ ] Configure domain and SSL
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Add analytics (PostHog, Plausible, etc.)

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│           Next.js 14 App Router             │
├─────────────────────────────────────────────┤
│  Marketing Pages  │  Dashboard (Studios)    │
├─────────────────────────────────────────────┤
│          API Routes (/api/*)                │
├─────────────────────────────────────────────┤
│  AI Utils  │  SEO Engine  │  Publishers    │
├─────────────────────────────────────────────┤
│  Prisma ORM  │  Storage  │  Job Scheduler  │
├─────────────────────────────────────────────┤
│        SQLite (dev) / Postgres (prod)       │
└─────────────────────────────────────────────┘
```

## Support

If you encounter issues:
1. Check this guide
2. Review the main README.md
3. Check TODO comments in the code
4. Open a GitHub issue

Happy building! 🚀
