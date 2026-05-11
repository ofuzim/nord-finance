import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { ApplicationFormPage } from '@/components/ApplicationFormPage'
import { Suspense } from 'react'
import { getCreditScoreRuntimeConfig } from '@/lib/creditScoreConfig'

export const metadata = {
  title: 'Application — Nord Finance',
  description: 'Complete your Nord Finance KYC application',
}

export const dynamic = 'force-dynamic'

export default async function ApplicationPage() {
  const { tiers } = await getCreditScoreRuntimeConfig()

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
      <Suspense fallback={null}>
        <ApplicationFormPage tiers={tiers} />
      </Suspense>
      <Footer />
    </div>
  )
}
