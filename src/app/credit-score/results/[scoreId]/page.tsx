import { Footer } from '@/components/Footer'
import { Navigation } from '@/components/Navigation'
import { CreditScoreCalculatorPage, type InitialCreditScoreResult } from '@/components/CreditScoreCalculatorPage'
import { getCreditScoreRuntimeConfig } from '@/lib/creditScoreConfig'
import { createServiceClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Credit Score Result - Nord Finance',
  description: 'Review your Nord Credit Score result',
}

export default async function CreditScoreResultPage({
  params,
}: {
  params: Promise<{ scoreId: string }>
}) {
  const { scoreId } = await params
  const [creditScoreConfig, service] = await Promise.all([
    getCreditScoreRuntimeConfig(),
    createServiceClient(),
  ])

  const { data, error } = await service
    .from('credit_scores')
    .select('monthly_income, monthly_obligations, down_payment_percentage, form_responses')
    .eq('id', scoreId)
    .maybeSingle()

  if (error || !data) notFound()

  const initialResult: InitialCreditScoreResult = {
    scoreId,
    values: (data.form_responses as Record<string, number>) ?? {},
    monthlyIncome: Number(data.monthly_income ?? 0),
    obligations: Number(data.monthly_obligations ?? 0),
    downPayment: Number(data.down_payment_percentage ?? 30),
  }

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh',
      }}
    >
      <Navigation />
      <CreditScoreCalculatorPage {...creditScoreConfig} initialResult={initialResult} hideHero />
      <Footer />
    </div>
  )
}
