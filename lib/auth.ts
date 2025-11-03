import { headers } from 'next/headers'
import { hasFeatureAccess, PLANS } from './plans'
import type { PlanType } from './plans'

/**
 * Check if current request is from a superuser
 */
export function isSuperuserRequest(): boolean {
  const headersList = headers()
  return headersList.get('x-superuser') === 'true'
}

/**
 * Get user plan with superuser override
 */
export function getUserPlan(userPlan: PlanType | string = 'FREE'): PlanType {
  if (isSuperuserRequest()) {
    return 'PRO' // Superuser gets PRO access
  }
  
  if (userPlan in PLANS) {
    return userPlan as PlanType
  }
  
  return 'FREE'
}

/**
 * Check feature access with superuser override
 */
export function checkFeatureAccess(userPlan: PlanType | string, feature: string): boolean {
  const effectivePlan = getUserPlan(userPlan)
  return hasFeatureAccess(effectivePlan, feature)
}

