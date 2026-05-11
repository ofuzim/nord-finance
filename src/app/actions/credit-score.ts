'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import {
  getCreditScoreTier,
  getCreditScoreBreakdown,
  getCreditScoreSignals,
} from '@/lib/creditScoreModel'
import { getCreditScoreRuntimeConfig } from '@/lib/creditScoreConfig'
import type { CreditTier } from '@/types/database'

const tierMap: Record<string, CreditTier> = {
  private_bridge: 'private_bridge',
  premium: 'premium',
  core: 'core',
  access: 'access',
  'Private Bridge': 'private_bridge',
  'Premium Tier': 'premium',
  'Core Tier': 'core',
  'Access Tier': 'access',
}

export async function saveCreditScore({
  score,
  values,
  monthlyIncome,
  obligations,
  downPayment,
  identity,
}: {
  score: number
  values: Record<string, number>
  monthlyIncome: number
  obligations: number
  downPayment: number
  identity?: { firstName?: string; lastName?: string; email?: string }
}): Promise<{ id: string } | { error: string }> {
  try {
    const supabase = await createClient()
    const { formConfig, tiers } = await getCreditScoreRuntimeConfig()
    const tier = getCreditScoreTier(score, tiers)
    const tierConfig = tiers.find((item) => score >= item.min_score) ?? tiers[tiers.length - 1]
    const breakdown = getCreditScoreBreakdown(values, formConfig)
    const signals = getCreditScoreSignals({ score, values, monthlyIncome, obligations, downPayment })

    const { data, error } = await supabase
      .from('credit_scores')
      .insert({
        first_name: identity?.firstName?.trim() || null,
        last_name: identity?.lastName?.trim() || null,
        email: identity?.email?.trim() || null,
        score,
        tier: tierMap[tierConfig?.name ?? ''] ?? tierMap[tierConfig?.label ?? tier.name] ?? 'access',
        monthly_income: monthlyIncome,
        monthly_obligations: obligations,
        down_payment_percentage: downPayment,
        form_responses: values,
        signals: {
          red: signals.filter(s => s.tone === 'red').map(s => s.text),
          yellow: signals.filter(s => s.tone === 'yellow').map(s => s.text),
          green: signals.filter(s => s.tone === 'green').map(s => s.text),
        },
        score_breakdown: Object.fromEntries(
          breakdown.map(b => [b.key, { name: b.name, weight: b.weight, score: b.score, points: b.points }])
        ),
      })
      .select('id')
      .single()

    if (error) return { error: error.message }
    return { id: data.id }
  } catch (err) {
    return { error: String(err) }
  }
}

export async function getCreditScoreById(id: string): Promise<
  {
    score: number
    monthlyIncome: number
    obligations: number
    downPayment: number
    formResponses: Record<string, number>
    firstName: string
    lastName: string
    email: string
  } | { error: string }
> {
  try {
    const service = await createServiceClient()
    const { data, error } = await service
      .from('credit_scores')
      .select('score, monthly_income, monthly_obligations, down_payment_percentage, form_responses, first_name, last_name, email')
      .eq('id', id)
      .single()
    if (error) return { error: error.message }
    return {
      score: data.score,
      monthlyIncome: data.monthly_income,
      obligations: data.monthly_obligations,
      downPayment: data.down_payment_percentage,
      formResponses: (data.form_responses as Record<string, number>) ?? {},
      firstName: data.first_name ?? '',
      lastName: data.last_name ?? '',
      email: data.email ?? '',
    }
  } catch (err) {
    return { error: String(err) }
  }
}
