import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.metric.deleteMany()
  await prisma.postDraft.deleteMany()
  await prisma.accountConnection.deleteMany()
  await prisma.seoPreset.deleteMany()
  await prisma.asset.deleteMany()
  await prisma.videoBrief.deleteMany()
  await prisma.user.deleteMany()

  // Create demo user with BUNDLE plan
  const user = await prisma.user.create({
    data: {
      id: 'demo-user-123',
      email: 'demo@cohengpt.com',
      name: 'Demo User',
      planType: 'BUNDLE', // Has access to Image + SEO + Scheduler
    },
  })

  console.log('✅ Created demo user:', user.email)

  // Create sample generated images
  const asset1 = await prisma.asset.create({
    data: {
      userId: user.id,
      url: '/uploads/demo-product-1.png',
      filename: 'demo-product-1.png',
      model: 'dalle',
      prompt: 'Luxury skincare product on marble surface with soft natural lighting',
      width: 1080,
      height: 1080,
      platform: 'instagram',
      hasProduct: true,
      productUrl: '/uploads/product-bottle.png',
      placement: 'center',
      scale: 0.8,
      rotation: 0,
      costEstimate: 0.04,
    },
  })

  const asset2 = await prisma.asset.create({
    data: {
      userId: user.id,
      url: '/uploads/demo-product-2.png',
      filename: 'demo-product-2.png',
      model: 'gemini',
      prompt: 'Modern minimalist tech product showcase with gradient background',
      width: 1000,
      height: 1500,
      platform: 'pinterest',
      hasProduct: false,
      costEstimate: 0.04,
    },
  })

  console.log('✅ Created 2 sample assets')

  // Create sample SEO presets
  const seo1 = await prisma.sEOPreset.create({
    data: {
      userId: user.id,
      platform: 'youtube',
      topic: 'Winter skincare routine for dry skin',
      title: '5-Step Winter Skincare Routine for Dry Skin | Transform Your Skin in 7 Days',
      description:
        'Struggling with dry winter skin? This complete 5-step skincare routine will hydrate and protect your skin all season. Featuring dermatologist-approved products and techniques.',
      tags: JSON.stringify([
        'winter skincare',
        'dry skin',
        'skincare routine',
        'beauty tips',
        'dermatologist approved',
      ]),
      caption: 'Winter doesn\'t have to mean dry, flaky skin. Try this routine! ❄️',
      score: 87,
      reasons: JSON.stringify([
        'Strong keyword placement in title',
        'Clear value proposition',
        'Relevant, searchable tags',
        'Engaging caption with CTA',
      ]),
      improvements: JSON.stringify([
        'Add 1-2 long-tail keywords in description',
        'Include timestamp mentions for better retention',
        'Consider adding trending hashtag #WinterSkincare2024',
      ]),
    },
  })

  const seo2 = await prisma.sEOPreset.create({
    data: {
      userId: user.id,
      platform: 'instagram',
      topic: 'New tech gadget launch',
      title: 'Introducing the Future of Smart Home Tech',
      description: '',
      tags: JSON.stringify([
        '#TechLaunch',
        '#SmartHome',
        '#Innovation',
        '#TechReview',
        '#GadgetLover',
      ]),
      caption:
        'The wait is over! Our newest innovation is here to transform your home. Swipe to see what makes it special 🚀',
      score: 78,
      reasons: JSON.stringify([
        'Good use of relevant hashtags',
        'Engaging opening',
        'Platform-appropriate emoji usage',
      ]),
      improvements: JSON.stringify([
        'Add more specific product keywords',
        'Include a question to drive engagement',
        'Consider adding 2-3 more niche hashtags',
      ]),
    },
  })

  console.log('✅ Created 2 sample SEO presets')

  // Create 2 scheduled posts (5 minutes from now)
  const now = new Date()
  const scheduledTime1 = new Date(now.getTime() + 2 * 60 * 1000) // 2 minutes
  const scheduledTime2 = new Date(now.getTime() + 4 * 60 * 1000) // 4 minutes

  const post1 = await prisma.postDraft.create({
    data: {
      userId: user.id,
      assetId: asset1.id,
      platform: 'instagram',
      caption: 'Elevate your skincare game this winter ❄️✨ #SkincareLuxury #WinterGlow',
      tags: JSON.stringify(['#skincare', '#beauty', '#luxurybeauty', '#wintercare']),
      scheduledAt: scheduledTime1,
      status: 'scheduled',
    },
  })

  const post2 = await prisma.postDraft.create({
    data: {
      userId: user.id,
      assetId: asset2.id,
      platform: 'pinterest',
      caption: 'Discover the future of tech 🚀 Pin this for your next upgrade!',
      tags: JSON.stringify(['tech', 'innovation', 'gadgets', 'smart home']),
      scheduledAt: scheduledTime2,
      status: 'scheduled',
    },
  })

  console.log('✅ Created 2 scheduled posts')

  // Create some mock account connections
  await prisma.accountConnection.create({
    data: {
      userId: user.id,
      platform: 'instagram',
      accountId: 'demo_instagram',
      accountName: '@demo_brand',
      isActive: false, // Not really connected, just a stub
    },
  })

  await prisma.accountConnection.create({
    data: {
      userId: user.id,
      platform: 'facebook',
      accountId: 'demo_facebook',
      accountName: 'Demo Brand Page',
      isActive: false,
    },
  })

  console.log('✅ Created account connection stubs')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
