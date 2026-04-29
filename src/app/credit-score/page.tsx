import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { CreditScoreCalculatorPage } from '@/components/CreditScoreCalculatorPage'

export const metadata = {
  title: 'Credit Score — Nord Finance',
  description: 'Understand and improve your Nord Credit Score',
}

export default function CreditScorePage() {
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
      <CreditScoreCalculatorPage />
      <Footer />
    </div>
  )
}
