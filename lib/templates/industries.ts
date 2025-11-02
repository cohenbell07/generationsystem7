/**
 * Industry-Specific Post Templates
 * Predefined templates for common business verticals
 */

export interface TemplateField {
  name: string
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'url'
  label: string
  placeholder?: string
  required?: boolean
  options?: string[] // For select fields
  defaultValue?: string
}

export interface PostTemplateData {
  id: string
  name: string
  industry: string
  platform: string
  description: string
  fields: TemplateField[]
  imagePrompt: string // Template with {{field}} placeholders
  captionTemplate: string // Template with {{field}} placeholders
  category: string
  tags: string[]
}

// ============================================
// Real Estate / Realtor Templates
// ============================================

export const REALTOR_TEMPLATES: PostTemplateData[] = [
  {
    id: 'realtor-open-house',
    name: 'Open House Announcement',
    industry: 'realtor',
    platform: 'instagram',
    description: 'Promote an upcoming open house event',
    category: 'event',
    tags: ['realestate', 'openhouse', 'property'],
    fields: [
      { name: 'address', type: 'text', label: 'Property Address', required: true },
      { name: 'price', type: 'text', label: 'Asking Price', placeholder: '$500,000' },
      { name: 'bedrooms', type: 'number', label: 'Bedrooms', defaultValue: '3' },
      { name: 'bathrooms', type: 'number', label: 'Bathrooms', defaultValue: '2' },
      { name: 'sqft', type: 'text', label: 'Square Footage', placeholder: '2,000 sqft' },
      { name: 'date', type: 'text', label: 'Open House Date', placeholder: 'Saturday 2-4pm' },
      { name: 'highlights', type: 'textarea', label: 'Key Features', placeholder: 'Renovated kitchen, hardwood floors...' },
    ],
    imagePrompt: 'Luxury home exterior photography, {{address}}, {{bedrooms}} bedroom house, modern architecture, professional real estate photo, bright sunny day, curb appeal',
    captionTemplate: '🏡 OPEN HOUSE ALERT! 🏡\n\n📍 {{address}}\n💰 {{price}}\n🛏️ {{bedrooms}} bed | 🛁 {{bathrooms}} bath | 📐 {{sqft}}\n\n✨ Features:\n{{highlights}}\n\n📅 {{date}}\n\nDM for private showing! 🔑\n\n#OpenHouse #RealEstate #DreamHome #HouseHunting #{{city}}Homes',
  },
  {
    id: 'realtor-just-listed',
    name: 'Just Listed',
    industry: 'realtor',
    platform: 'instagram',
    description: 'Announce a new property listing',
    category: 'listing',
    tags: ['realestate', 'newlisting', 'forsale'],
    fields: [
      { name: 'address', type: 'text', label: 'Property Address', required: true },
      { name: 'price', type: 'text', label: 'Asking Price', required: true },
      { name: 'bedrooms', type: 'number', label: 'Bedrooms' },
      { name: 'bathrooms', type: 'number', label: 'Bathrooms' },
      { name: 'description', type: 'textarea', label: 'Property Description' },
    ],
    imagePrompt: 'Professional real estate listing photo, {{address}}, {{bedrooms}} bedroom home, luxurious interior, high-end staging, natural lighting, magazine quality',
    captionTemplate: '🎉 JUST LISTED! 🎉\n\n{{description}}\n\n📍 {{address}}\n💵 {{price}}\n🏠 {{bedrooms}} BD | {{bathrooms}} BA\n\nThis won\'t last long! Contact me today.\n\n#JustListed #NewListing #RealEstate #ForSale #HomesForSale',
  },
  {
    id: 'realtor-sold',
    name: 'Sold Announcement',
    industry: 'realtor',
    platform: 'instagram',
    description: 'Celebrate a successful sale',
    category: 'success',
    tags: ['realestate', 'sold', 'success'],
    fields: [
      { name: 'address', type: 'text', label: 'Property Address', required: true },
      { name: 'daysOnMarket', type: 'number', label: 'Days on Market' },
      { name: 'clientTestimonial', type: 'textarea', label: 'Client Testimonial (optional)' },
    ],
    imagePrompt: 'Real estate SOLD sign in front of beautiful home, {{address}}, celebration, professional photography, golden hour lighting',
    captionTemplate: '🎊 SOLD! 🎊\n\nAnother happy family moving into their dream home! {{address}} sold in just {{daysOnMarket}} days.\n\n{{clientTestimonial}}\n\nReady to sell YOUR home? Let\'s chat!\n\n#Sold #RealEstateAgent #HappyClients #DreamHome',
  },
]

// ============================================
// Automotive / Car Dealership Templates
// ============================================

export const AUTOMOTIVE_TEMPLATES: PostTemplateData[] = [
  {
    id: 'auto-new-arrival',
    name: 'New Inventory Arrival',
    industry: 'automotive',
    platform: 'instagram',
    description: 'Showcase a new vehicle in stock',
    category: 'inventory',
    tags: ['cars', 'automotive', 'newarrival'],
    fields: [
      { name: 'year', type: 'text', label: 'Year', required: true },
      { name: 'make', type: 'text', label: 'Make', required: true },
      { name: 'model', type: 'text', label: 'Model', required: true },
      { name: 'trim', type: 'text', label: 'Trim Level' },
      { name: 'price', type: 'text', label: 'Price', placeholder: '$35,999' },
      { name: 'mileage', type: 'text', label: 'Mileage', placeholder: '12,000 miles' },
      { name: 'features', type: 'textarea', label: 'Key Features' },
    ],
    imagePrompt: 'Luxury car dealership photography, {{year}} {{make}} {{model}}, showroom lighting, professional automotive photo, sleek modern design, detailed shot',
    captionTemplate: '🚗 NEW ARRIVAL ALERT! 🚗\n\n{{year}} {{make}} {{model}} {{trim}}\n\n💰 {{price}}\n📊 {{mileage}}\n\n✨ Features:\n{{features}}\n\n🔥 This beauty won\'t last long!\nDM us or visit the showroom today!\n\n#NewArrival #CarsForSale #{{make}} #{{model}} #LuxuryCars #CarDealer',
  },
  {
    id: 'auto-special-offer',
    name: 'Special Financing Offer',
    industry: 'automotive',
    platform: 'facebook',
    description: 'Promote financing deals',
    category: 'promotion',
    tags: ['automotive', 'sale', 'financing'],
    fields: [
      { name: 'offerTitle', type: 'text', label: 'Offer Title', placeholder: '0% APR for 60 months' },
      { name: 'details', type: 'textarea', label: 'Offer Details' },
      { name: 'endDate', type: 'text', label: 'Offer End Date' },
    ],
    imagePrompt: 'Car dealership sale promotion, multiple vehicles in showroom, professional photography, "SALE" signage, bright and inviting',
    captionTemplate: '💥 LIMITED TIME OFFER! 💥\n\n{{offerTitle}}\n\n{{details}}\n\n⏰ Offer ends {{endDate}}\n\nDon\'t miss out! Contact us today to take advantage of this incredible deal.\n\n#CarSale #Financing #SpecialOffer #DealOfTheDay',
  },
]

// ============================================
// Med Spa / Beauty Templates
// ============================================

export const MEDSPA_TEMPLATES: PostTemplateData[] = [
  {
    id: 'medspa-treatment-promo',
    name: 'Treatment Promotion',
    industry: 'medspa',
    platform: 'instagram',
    description: 'Promote a specific treatment or service',
    category: 'service',
    tags: ['medspa', 'beauty', 'skincare'],
    fields: [
      { name: 'treatment', type: 'text', label: 'Treatment Name', required: true },
      { name: 'benefits', type: 'textarea', label: 'Key Benefits' },
      { name: 'discount', type: 'text', label: 'Special Offer', placeholder: '20% off first session' },
      { name: 'duration', type: 'text', label: 'Session Duration' },
    ],
    imagePrompt: 'Luxury med spa treatment room, {{treatment}}, serene atmosphere, professional medical aesthetics, clean modern design, spa ambiance',
    captionTemplate: '✨ Transform Your Skin with {{treatment}} ✨\n\n{{benefits}}\n\n⏱️ Session: {{duration}}\n🎁 Special Offer: {{discount}}\n\nBook your consultation today and reveal your best skin!\n\n📞 DM to schedule\n\n#MedSpa #{{treatment}} #Skincare #Beauty #SelfCare #GlowUp',
  },
  {
    id: 'medspa-before-after',
    name: 'Before & After Showcase',
    industry: 'medspa',
    platform: 'instagram',
    description: 'Show treatment results (with consent)',
    category: 'results',
    tags: ['medspa', 'beforeafter', 'results'],
    fields: [
      { name: 'treatment', type: 'text', label: 'Treatment Used', required: true },
      { name: 'sessions', type: 'number', label: 'Number of Sessions' },
      { name: 'timeframe', type: 'text', label: 'Timeframe', placeholder: '8 weeks' },
      { name: 'clientFeedback', type: 'textarea', label: 'Client Testimonial' },
    ],
    imagePrompt: 'Medical spa before and after comparison, {{treatment}} results, professional clinical photography, side-by-side transformation',
    captionTemplate: '🌟 REAL RESULTS 🌟\n\nTreatment: {{treatment}}\nSessions: {{sessions}}\nTimeframe: {{timeframe}}\n\n"{{clientFeedback}}"\n\nReady for your transformation? Book a free consultation!\n\n*Results may vary. Photos shared with client consent.\n\n#BeforeAndAfter #MedSpa #{{treatment}} #SkinTransformation #RealResults',
  },
]

// ============================================
// Restaurant Templates
// ============================================

export const RESTAURANT_TEMPLATES: PostTemplateData[] = [
  {
    id: 'restaurant-special',
    name: 'Daily Special',
    industry: 'restaurant',
    platform: 'instagram',
    description: 'Promote daily or weekly specials',
    category: 'menu',
    tags: ['restaurant', 'food', 'special'],
    fields: [
      { name: 'dishName', type: 'text', label: 'Dish Name', required: true },
      { name: 'description', type: 'textarea', label: 'Description' },
      { name: 'price', type: 'text', label: 'Price' },
      { name: 'availableDays', type: 'text', label: 'Available', placeholder: 'Today only!' },
    ],
    imagePrompt: 'Professional food photography, {{dishName}}, restaurant quality plating, delicious presentation, overhead shot, natural lighting, appetizing',
    captionTemplate: '🍽️ TODAY\'S SPECIAL 🍽️\n\n{{dishName}}\n{{description}}\n\n💰 {{price}}\n📅 {{availableDays}}\n\nCome taste the difference!\nReservations: [phone/link]\n\n#FoodSpecial #Restaurant #Foodie #DeliciousFood #LocalEats',
  },
  {
    id: 'restaurant-event',
    name: 'Event Announcement',
    industry: 'restaurant',
    platform: 'facebook',
    description: 'Promote restaurant events',
    category: 'event',
    tags: ['restaurant', 'event', 'nightlife'],
    fields: [
      { name: 'eventName', type: 'text', label: 'Event Name', required: true },
      { name: 'date', type: 'text', label: 'Date & Time', required: true },
      { name: 'details', type: 'textarea', label: 'Event Details' },
      { name: 'ticketInfo', type: 'text', label: 'Ticket/Reservation Info' },
    ],
    imagePrompt: 'Restaurant event atmosphere, {{eventName}}, lively dining scene, elegant ambiance, people enjoying food and drinks, professional hospitality photography',
    captionTemplate: '🎉 EVENT ANNOUNCEMENT 🎉\n\n{{eventName}}\n📅 {{date}}\n\n{{details}}\n\n🎫 {{ticketInfo}}\n\nLimited spots available!\nReserve now: [link]\n\n#RestaurantEvent #LocalEvents #Foodie #NightOut',
  },
]

// ============================================
// Template Registry
// ============================================

export const ALL_TEMPLATES: PostTemplateData[] = [
  ...REALTOR_TEMPLATES,
  ...AUTOMOTIVE_TEMPLATES,
  ...MEDSPA_TEMPLATES,
  ...RESTAURANT_TEMPLATES,
]

export const TEMPLATES_BY_INDUSTRY: Record<string, PostTemplateData[]> = {
  realtor: REALTOR_TEMPLATES,
  automotive: AUTOMOTIVE_TEMPLATES,
  medspa: MEDSPA_TEMPLATES,
  restaurant: RESTAURANT_TEMPLATES,
}

// ============================================
// Template Functions
// ============================================

/**
 * Get all templates for an industry
 */
export function getTemplatesByIndustry(industry: string): PostTemplateData[] {
  return TEMPLATES_BY_INDUSTRY[industry] || []
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): PostTemplateData | undefined {
  return ALL_TEMPLATES.find((t) => t.id === id)
}

/**
 * Fill template with user data
 */
export function fillTemplate(
  template: PostTemplateData,
  data: Record<string, string>
): {
  caption: string
  imagePrompt: string
} {
  let caption = template.captionTemplate
  let imagePrompt = template.imagePrompt

  // Replace all {{field}} placeholders
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{${key}}}`, 'g')
    caption = caption.replace(placeholder, value || '')
    imagePrompt = imagePrompt.replace(placeholder, value || '')
  })

  // Clean up any remaining unfilled placeholders
  caption = caption.replace(/{{[^}]+}}/g, '[Not specified]')
  imagePrompt = imagePrompt.replace(/{{[^}]+}}/g, '')

  return { caption, imagePrompt }
}

/**
 * Auto-fill template fields with AI
 */
export async function autoFillTemplate(
  template: PostTemplateData,
  partialData: Record<string, string>
): Promise<Record<string, string>> {
  // This would call AI to fill in missing fields intelligently
  // For now, return the partial data as-is
  // Implementation would use callGPTJSON from lib/ai/llm.ts
  return partialData
}

/**
 * Get list of all industries
 */
export function getAllIndustries(): string[] {
  return Object.keys(TEMPLATES_BY_INDUSTRY)
}

/**
 * Get industry display name
 */
export function getIndustryDisplayName(industry: string): string {
  const names: Record<string, string> = {
    realtor: 'Real Estate',
    automotive: 'Automotive / Car Sales',
    medspa: 'Med Spa / Beauty',
    restaurant: 'Restaurant / Food Service',
  }
  return names[industry] || industry
}
