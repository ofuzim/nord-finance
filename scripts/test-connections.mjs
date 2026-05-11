import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Load .env.local manually (no dotenv dependency needed)
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env.local')
const envLines = readFileSync(envPath, 'utf8').split('\n')
for (const line of envLines) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const [key, ...rest] = trimmed.split('=')
  process.env[key.trim()] = rest.join('=').trim()
}

let supabaseOk = false
let smtpOk = false

// ─── Supabase ─────────────────────────────────────────────────────────────────
console.log('\n── Supabase ──────────────────────────────────')
try {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // Query the public applications table (anon key has read access via RLS)
  const { error: appError } = await supabase
    .from('applications')
    .select('id')
    .limit(1)

  if (appError) {
    console.error('❌ Supabase query failed:', appError.message)
    if (appError.message.includes('does not exist')) {
      console.error('   → Migration not run yet. Paste 001_initial_schema.sql into Supabase SQL Editor and run it.')
    }
  } else {
    console.log('✅ Supabase connected and tables are reachable.')
    supabaseOk = true
  }
} catch (err) {
  console.error('❌ Supabase connection error:', err.message)
}

// ─── SMTP ─────────────────────────────────────────────────────────────────────
console.log('\n── SMTP ───────────────────────────────────────')
try {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.verify()
  console.log('✅ SMTP server reachable and credentials accepted.')
  smtpOk = true
} catch (err) {
  console.error('❌ SMTP failed:', err.message)
}

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log('\n── Summary ────────────────────────────────────')
console.log('Supabase:', supabaseOk ? '✅ OK' : '❌ Failed')
console.log('SMTP:    ', smtpOk ? '✅ OK' : '❌ Failed')
console.log('')
if (!supabaseOk || !smtpOk) process.exit(1)
