import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { FinanceAssetsPage as FinanceAssetsPageContent } from '@/components/FinanceAssetsPage'
import { FAQ } from '@/components/FAQ'

export const metadata = {
  title: 'Finance Assets — Nord Finance',
  description: 'Finance your assets with Nord Finance',
}

export default function FinanceAssetsPage() {
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
      <FinanceAssetsPageContent />
      <FAQ />
      <Footer />
    </div>
  )
}
