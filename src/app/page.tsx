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

export default function HomePage() {
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
      <Hero />
<HowItWorks />
      <WhatIsNord />
      <CarShowcase />
<LoanCalculator />
      <FAQ />
      <CTABand />
      <Footer />
    </div>
  )
}
