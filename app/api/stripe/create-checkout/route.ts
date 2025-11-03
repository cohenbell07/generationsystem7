import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PLANS } from '@/lib/plans'

// Initialize Stripe only if API key is available
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
    })
  : null

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        {
          error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your .env file.',
          mock: true,
          message: 'In development mode, use ?adminpw=admin123 to bypass payment requirements.',
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { planId, userId } = body

    if (!planId) {
      return NextResponse.json(
        { error: 'Missing planId' },
        { status: 400 }
      )
    }

    const plan = PLANS[planId as keyof typeof PLANS]
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: plan.features.join(', '),
            },
            recurring: {
              interval: 'month',
            },
            unit_amount: plan.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing?canceled=true`,
      metadata: {
        userId: userId || 'guest',
        planId: planId,
      },
    })

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })
  } catch (error: any) {
    console.error('Stripe checkout error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

