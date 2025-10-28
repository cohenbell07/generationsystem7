# Terminal Commands for AI Marketer Setup

Copy and paste these commands in order to get your app running at http://localhost:3000

## Step 1: Install Dependencies

```bash
npm install
```

**Expected time**: 2-3 minutes

## Step 2: Configure Environment

```bash
# Copy the environment template
cp .env.example .env
```

**Then edit `.env` and add your API keys**:

At minimum, you need:
```env
OPENAI_API_KEY=sk-your-key-here
```

To get an OpenAI API key:
1. Visit https://platform.openai.com
2. Sign up / Log in
3. Go to API Keys section
4. Create new secret key
5. Copy and paste into `.env`

## Step 3: Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Create database with schema
npx prisma db push

# Seed with demo data
npm run db:seed
```

**Expected output from seed**:
```
🌱 Seeding database...
✅ Created demo user: demo@aimarketer.com
✅ Created 2 sample assets
✅ Created 2 sample SEO presets
✅ Created 2 scheduled posts
✅ Created account connection stubs
🎉 Database seeded successfully!
```

## Step 4: Create Uploads Directory

```bash
mkdir -p uploads/images uploads/products uploads/backgrounds
```

## Step 5: Run the Application

```bash
npm run dev
```

**Expected output**:
```
🚀 Starting job scheduler...
✅ Scheduler started (checks every minute)
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in xxxms
```

## Step 6: Open in Browser

Open http://localhost:3000 in your browser!

---

## One-Line Quick Start (Alternative)

If you prefer, run everything at once:

```bash
npm install && \
cp .env.example .env && \
echo "⚠️  EDIT .env NOW AND ADD YOUR OPENAI_API_KEY" && \
read -p "Press Enter after editing .env..." && \
npx prisma generate && \
npx prisma db push && \
npm run db:seed && \
mkdir -p uploads/images uploads/products uploads/backgrounds && \
npm run dev
```

---

## What You'll See

### Home Page (/)
- Marketing website
- Feature overview
- Pricing information
- "Go to App" button

### Image Studio (/studio/image)
- Model selector (DALL·E / Gemini)
- Prompt input
- Platform presets
- Product upload & compositing
- Generate button

### SEO Studio (/studio/seo)
- Platform selector
- Topic input
- Tone selector
- Generate button
- SEO Score display
- Improvement suggestions

### Scheduler (/studio/scheduler)
- List of scheduled posts
- Demo posts from seed data
- Posts will auto-publish when scheduled time arrives
- Watch the console for "Publishing post..." messages

### Analytics (/studio/analytics)
- Pro upgrade prompt
- Feature descriptions
- Pricing

### Video (/studio/video)
- Manual service form
- Brief submission

---

## Testing the Features

### Test Image Generation

1. Navigate to http://localhost:3000/studio/image
2. Select "DALL·E 3" as model
3. Enter prompt: "Luxury perfume bottle on marble surface with soft lighting"
4. Select platform: "Instagram Square"
5. Click "Generate Images"
6. Wait 10-20 seconds
7. See generated image(s)

**Requirements**: `OPENAI_API_KEY` must be set in `.env`

### Test SEO Generation

1. Navigate to http://localhost:3000/studio/seo
2. Select platform: "YouTube"
3. Enter topic: "10-minute morning skincare routine for dry skin"
4. Select tone: "Neutral"
5. Click "Generate SEO Content"
6. Wait 5-10 seconds
7. See title, description, tags, caption, and SEO score

**Requirements**: `OPENAI_API_KEY` must be set in `.env`

### Test Scheduler

1. Navigate to http://localhost:3000/studio/scheduler
2. See 2 demo scheduled posts
3. Check the times - they're scheduled 2 and 4 minutes from when you ran the seed
4. Watch your terminal running `npm run dev`
5. Within 5 minutes, you'll see:
   ```
   ⏰ Processing 1 scheduled post(s)...
   📤 Publishing post xxx to instagram...
   ✅ Post published successfully
   ```
6. Refresh the scheduler page - post status changed to "published"

---

## Troubleshooting

### Error: "OPENAI_API_KEY is not set"
- Open `.env` file
- Add your OpenAI API key: `OPENAI_API_KEY=sk-...`
- Restart `npm run dev`

### Error: "Prisma client is not generated"
```bash
npx prisma generate
```

### Error: "Port 3000 is already in use"
```bash
PORT=3001 npm run dev
```

### Error: Cannot upload files
```bash
mkdir -p uploads/images uploads/products uploads/backgrounds
```

### Starting fresh (reset everything)
```bash
# Stop the dev server (Ctrl+C)
rm -rf node_modules package-lock.json prisma/dev.db
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

---

## Next Steps

1. **Explore the app**: Try all features
2. **Read README.md**: Comprehensive documentation
3. **Read SETUP.md**: Detailed setup guide
4. **Check TODO comments**: Production integration points
5. **Customize**: Edit marketing pages, branding, plans
6. **Deploy**: Follow deployment guide in README

---

## API Keys You'll Need

### Required (to use the app)
- **OpenAI**: For DALL·E image generation and SEO content
  - Get at: https://platform.openai.com
  - Add to `.env` as: `OPENAI_API_KEY=sk-...`

### Optional (for additional features)
- **Google Gemini**: For Gemini image generation (currently stub)
  - Get at: https://makersuite.google.com
  - Add to `.env` as: `GOOGLE_GEMINI_API_KEY=...`

- **Google Trends**: For enhanced SEO signals
- **YouTube Data**: For competitor analysis
- **SerpApi**: For SERP analysis

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run db:push` | Update database schema |
| `npm run db:seed` | Seed demo data |
| `npm run demo` | Full demo (push + seed + dev) |

---

**Built with ❤️ using Next.js, TypeScript, and AI**

Need help? Check README.md and SETUP.md for detailed documentation.
