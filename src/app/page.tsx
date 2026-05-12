import { Navigation } from '@/components/Navigation'
import { HashScroll } from '@/components/HashScroll'
import { Hero } from '@/components/Hero'
import { HowItWorks } from '@/components/HowItWorks'
import { CarShowcase } from '@/components/CarShowcase'
import { WhatIsNord } from '@/components/WhatIsNord'
import { LoanCalculator } from '@/components/LoanCalculator'
import { FAQ } from '@/components/FAQ'
import { CTABand } from '@/components/CTABand'
import { Footer } from '@/components/Footer'
import { getCreditScoreRuntimeConfig } from '@/lib/creditScoreConfig'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { vehicleCatalog } = await getCreditScoreRuntimeConfig()

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: '#000',
        color: '#fff',
        overflowX: 'hidden',
      }}
    >
      <Navigation />
      <HashScroll />
      <Hero vehicleCatalog={vehicleCatalog} />
<HowItWorks />
      <WhatIsNord />
      <CarShowcase vehicleCatalog={vehicleCatalog} />
<LoanCalculator vehicleCatalog={vehicleCatalog} />
      <FAQ />
      <CTABand />
      <Footer />
    </div>
  )
}
