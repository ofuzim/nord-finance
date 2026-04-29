import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Products — Nord Finance',
  description: 'Explore Nord Finance auto loan products',
}

export default function ProductsPage() {
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
        {/* Products page content goes here */}
      </main>
      <Footer />
    </div>
  )
}
