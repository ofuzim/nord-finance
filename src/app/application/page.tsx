import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { ApplicationFormPage } from '@/components/ApplicationFormPage'
import { Suspense } from 'react'

export const metadata = {
  title: 'Application — Nord Finance',
  description: 'Complete your Nord Finance KYC application',
}

export default function ApplicationPage() {
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
        <ApplicationFormPage />
      </Suspense>
      <Footer />
    </div>
  )
}
