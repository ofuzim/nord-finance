import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { CreditScoreCalculatorPage } from '@/components/CreditScoreCalculatorPage'
import { getCreditScoreRuntimeConfig } from '@/lib/creditScoreConfig'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Credit Score — Nord Finance',
  description: 'Understand and improve your Nord Credit Score',
}

export const dynamic = 'force-dynamic'

export default async function CreditScorePage({
  searchParams,
}: {
  searchParams?: Promise<{ scoreId?: string }>
}) {
  const params = await searchParams
  if (params?.scoreId) redirect(`/credit-score/results/${params.scoreId}`)

  const creditScoreConfig = await getCreditScoreRuntimeConfig()

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
      <CreditScoreCalculatorPage {...creditScoreConfig} />
      <Footer />
    </div>
  )
}
