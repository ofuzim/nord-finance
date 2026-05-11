'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'rgba(255,255,255,0.055)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '13px 16px',
  color: 'white',
  fontFamily: "'Poppins', sans-serif",
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const unauthorizedError = searchParams.get('error') === 'unauthorized'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(unauthorizedError ? 'Your account does not have admin access.' : '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <>
      {error && (
        <div style={{ marginBottom: 20, padding: '12px 16px', backgroundColor: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
          <p style={{ color: '#ef4444', fontSize: 13 }}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 8,
            backgroundColor: '#C39529',
            color: '#000',
            border: 'none',
            borderRadius: 8,
            padding: '14px',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </>
  )
}

export default function AdminLogin() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px rgba(20,20,20,1) inset !important;
          -webkit-text-fill-color: white !important;
          caret-color: white;
        }
      `}</style>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 812" width="22" height="40">
            <path fill="#C39529" d="M449.02,262.97s-9.98-31.01-37.85-70.89c-27.87-39.87-54.76-60.6-54.76-60.6,0,0-34.17,3.73-66.15,63.17-14.86,27.63-15.01,89.18-15.01,122.62,0,215.67-2.31,325.28-2.31,325.28l-12.58,11.43s-1.27-228.24,5.25-402.33c1.87-49.88,22.78-82.17,27.22-88.3,23.99-33.16,59.17-46.73,59.17-46.73,0,0-17.15-28.73-51.88-60.03C274.45,33.45,224.81,0,224.81,0c0,0-42.59,25.73-76.89,58.31-34.3,32.59-48.45,57.88-48.45,57.88,0,0,32.34,14.35,54.02,40.73,17.33,21.09,28.3,56.6,29.88,76.3,4.72,25.3,8.71,421.48,8.71,421.48l-12.4-12.65s-5.17-163.55-6.07-287.9c-.86-118.34-3.86-138.4-13.68-159.07-18.15-47.31-65.34-64.74-65.34-64.74,0,0-31.13,23.58-57.77,63.28C13.69,228.09,0,261.54,0,261.54l54.57,34.59S3.86,388.45,16.29,534.65c5.63,66.21,39.63,164.32,85.32,213.52,55.2,59.44,102.81,63.6,123.2,63.6,20.39,0,54.13,1.15,105.76-43.45,41.57-35.92,80.65-107.8,95.18-185.65,32.59-174.5-25.89-289.98-25.89-289.98l49.16-29.73ZM358.01,652.27c-51.58,119.03-133.2,111.48-133.2,111.48,0,0-83.04,11.48-137.35-122-69.75-149.87,1.72-321.56,1.72-321.56,0,0,14.94,13.34,27.44,30.3,9.66,13.1,19.29,36.33,23.32,55.41,14.27,67.51,13.98,234.38,13.98,234.38l70.89,71.17,72.31-70.32s-1.75-180.43,16.44-240.34c6.02-19.84,13.45-37.91,20.15-49.88,12.01-21.44,29.87-32.16,29.87-32.16,0,0,72.46,153.45-5.57,333.52Z"/>
          </svg>
          <div>
            <p style={{ color: 'white', fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>Nord Finance</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Admin Panel</p>
          </div>
        </div>

        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Sign in</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 32 }}>Use your admin credentials to continue.</p>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <p style={{ marginTop: 28, textAlign: 'center' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textDecoration: 'none', letterSpacing: '0.06em' }}>
            ← Back to Nord Finance
          </a>
        </p>
      </div>
    </div>
  )
}
