# AI Marketer

A complete, production-ready AI-powered marketing platform built with Next.js 14, TypeScript, and Tailwind CSS. Generate stunning ad-grade images, SEO-optimized content, and schedule posts across multiple social media platforms—all in one place.

## Features

### 🎨 Image Studio
- **Dual AI Models**: Choose between DALL·E 3 or Google Gemini Image
- **Product Compositing**: Upload product images and composite them onto AI-generated backgrounds
- **Platform Presets**: Instagram, Pinterest, Facebook, TikTok, LinkedIn, Blog, Twitter
- **One-Click Resize**: Instantly resize generated images to other platform formats
- **Advanced Controls**: Adjust product placement, scale, and rotation

### 📝 SEO Studio
- **Platform-Aware Generation**: Optimized content for YouTube, Instagram, TikTok, Facebook, LinkedIn, Pinterest, and more
- **SEO Scoring**: Numeric score (0-100) with detailed breakdown
- **Actionable Improvements**: Specific suggestions to boost your SEO score
- **Multiple Tones**: Neutral, Playful, Luxury, Authoritative
- **Keyword Analysis**: Automatic keyword extraction and placement optimization

### 📅 Post Scheduler
- **Multi-Platform Scheduling**: Queue posts for all major social platforms
- **Calendar View**: Visual overview of all scheduled content
- **Automated Publishing**: Posts publish automatically at scheduled times (via cron)
- **Draft Management**: Save and edit drafts before scheduling

### 📊 Analytics (Pro)
- **Performance Tracking**: Monitor impressions, clicks, and engagement
- **Best-Time Suggestions**: AI-powered recommendations for optimal posting times
- **Autoposting**: Automatically post at peak engagement times
- **Cross-Platform Insights**: Compare performance across platforms

### 🎥 Video (Manual Service)
- Custom video production service placeholder
- Brief submission system with file uploads

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Database**: SQLite (Prisma ORM) - ready to switch to PostgreSQL
- **AI APIs**: OpenAI (DALL·E 3), Google Generative AI
- **Image Processing**: Sharp
- **Job Scheduling**: node-cron (dev) - documented to swap to Bull/BullMQ
- **File Storage**: Local filesystem (dev) - abstracted for S3/R2 swap

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Add your API keys to .env:
# OPENAI_API_KEY=sk-...
# GOOGLE_GEMINI_API_KEY=...

# Initialize database
npx prisma db push

# Seed demo data
npm run db:seed

# Start development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Demo Script

Run the full demo with seeded data:

```bash
npm run demo
```

This will:
1. Push database schema
2. Seed demo user and sample data
3. Start dev server with cron scheduler

## Environment Variables

Create a `.env` file in the root directory:

```env
# OpenAI (Required for DALL·E and SEO generation)
OPENAI_API_KEY=sk-...

# Google (Required for Gemini Image generation)
GOOGLE_GEMINI_API_KEY=...

# Optional external signals (for enhanced SEO)
GOOGLE_TRENDS_API_KEY=
YOUTUBE_DATA_API_KEY=
SERPAPI_KEY=

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
UPLOAD_DIR=./uploads
DATABASE_URL="file:./dev.db"
```

## Project Structure

```
├── app/
│   ├── (marketing)/          # Public marketing pages
│   │   ├── page.tsx           # Home
│   │   ├── features/          # Features page
│   │   ├── pricing/           # Pricing page
│   │   └── contact/           # Contact page
│   ├── (dashboard)/           # Protected dashboard
│   │   ├── layout.tsx         # Dashboard layout with sidebar
│   │   └── studio/
│   │       ├── image/         # Image generation studio
│   │       ├── seo/           # SEO content studio
│   │       ├── scheduler/     # Post scheduler
│   │       ├── analytics/     # Analytics (Pro)
│   │       └── video/         # Video service page
│   ├── api/
│   │   ├── image/generate/    # Image generation endpoint
│   │   ├── seo/generate/      # SEO generation endpoint
│   │   ├── posts/schedule/    # Post scheduling endpoint
│   │   └── uploads/           # File upload endpoint
│   ├── globals.css            # Global styles
│   └── layout.tsx             # Root layout
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── studio/                # Custom studio components
│   └── marketing/             # Marketing components
├── lib/
│   ├── ai/
│   │   ├── dalle.ts           # DALL·E integration
│   │   ├── geminiImage.ts     # Gemini Image integration
│   │   └── composite.ts       # Image compositing utilities
│   ├── seo/
│   │   ├── platformProfiles.ts # Platform configurations
│   │   ├── generate.ts         # SEO generation
│   │   └── score.ts            # SEO scoring algorithm
│   ├── publishers/             # Social platform adapters
│   │   ├── facebook.ts
│   │   ├── instagram.ts
│   │   ├── tiktok.ts
│   │   ├── linkedin.ts
│   │   ├── pinterest.ts
│   │   └── youtube.ts
│   ├── jobs/
│   │   └── scheduler.ts        # Cron job scheduler
│   ├── db.ts                   # Prisma client
│   ├── storage.ts              # Storage abstraction
│   ├── utils.ts                # Utility functions
│   └── plans.ts                # Plan management
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seeder
└── README.md
```

## Deployment

### Database Migration (SQLite → PostgreSQL)

1. Update `DATABASE_URL` in `.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

2. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Run migration:
```bash
npx prisma migrate dev
```

### Storage Migration (Local → S3)

Replace functions in `lib/storage.ts`:

1. Install AWS SDK:
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

2. Add to `.env`:
```env
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET=your-bucket-name
```

3. Update storage functions to use S3 (see TODO comments in `lib/storage.ts`)

### Job Queue Migration (node-cron → BullMQ)

Replace `lib/jobs/scheduler.ts` with a proper queue:

1. Install Bull:
```bash
npm install bull redis
```

2. Set up Redis instance

3. Replace cron logic with Bull queue (see TODO comments in `lib/jobs/scheduler.ts`)

### Publisher API Integration

Each publisher in `lib/publishers/` has TODO comments for real API integration:

- **Facebook**: Graph API
- **Instagram**: Graph API (requires Business account)
- **TikTok**: Content Posting API
- **LinkedIn**: Share API
- **Pinterest**: Pins API
- **YouTube**: Data API v3

Refer to each file's documentation comments for specific integration steps.

### Deployment Platforms

**Vercel** (Recommended):
```bash
npm run build
vercel
```

**Docker**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## API Keys

### OpenAI (DALL·E & SEO)
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add to `.env` as `OPENAI_API_KEY`

### Google Gemini Image
1. Go to [Google AI Studio](https://makersuite.google.com/)
2. Get an API key
3. Add to `.env` as `GOOGLE_GEMINI_API_KEY`

**Note**: For production Gemini Image generation, you'll need to integrate Vertex AI Imagen. See TODOs in `lib/ai/geminiImage.ts`.

### Optional: External SEO Signals
- **Google Trends**: [Google Trends API](https://trends.google.com/trends/)
- **YouTube Data**: [Google Cloud Console](https://console.cloud.google.com/)
- **SerpApi**: [SerpApi](https://serpapi.com/)

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Push database schema (no migrations)
npm run db:push

# Seed database with demo data
npm run db:seed

# Full demo (push + seed + dev)
npm run demo
```

## Testing

The app includes demo data for testing:

- **Demo User**: `demo@aimarketer.com` (Plan: BUNDLE)
- **Sample Images**: 2 pre-generated assets
- **Sample SEO**: 2 SEO presets (YouTube & Instagram)
- **Scheduled Posts**: 2 posts scheduled within 5 minutes of seeding

Test the scheduler by running `npm run demo` and watching the console for automated post publishing.

## Important Notes

### Image Generation
- **No prompt rewriting**: User prompts are passed exactly as-is to AI models
- **DALL·E 3**: Generates 1 image per request (API limitation)
- **Gemini Image**: Currently uses dev stub - integrate Vertex AI for production

### Product Compositing
- Currently assumes products have transparent backgrounds
- For automatic background removal, integrate:
  - remove.bg API (easiest)
  - U²-Net local model
  - ClipDrop API
- See TODO comments in `lib/ai/composite.ts`

### SEO Scoring
- Deterministic algorithm based on:
  - Keyword placement
  - Length constraints
  - Tag diversity
  - Platform-specific best practices
  - Readability metrics

### Job Scheduler
- Uses node-cron in dev (good for demo)
- For production, migrate to Bull/BullMQ with Redis
- See migration guide in `lib/jobs/scheduler.ts`

## Troubleshooting

### "OpenAI API key not set"
Add your OpenAI API key to `.env` file.

### "Prisma client not generated"
Run `npx prisma generate`.

### Images not displaying
Ensure `uploads/` directory exists: `mkdir -p uploads`

### Scheduler not running
The scheduler starts automatically with `npm run dev`. Check console for "Scheduler started" message.

### Port 3000 already in use
Change port: `PORT=3001 npm run dev`

## License

MIT

## Support

For questions or issues, please open a GitHub issue or contact hello@aimarketer.com.

---

Built with ❤️ using Next.js, TypeScript, and AI
