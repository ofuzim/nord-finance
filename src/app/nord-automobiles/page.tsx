import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Nord Automobiles — Nord Finance',
  description: 'Browse vehicles through Nord Automobiles',
}

export default function NordAutomobilesPage() {
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
      <main style={{ paddingTop: 72 }}>
        {/* Nord Automobiles page content goes here */}
      </main>
      <Footer />
    </div>
  )
}
