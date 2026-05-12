import { notFound } from 'next/navigation'
import { requireSuperAdmin } from '@/lib/admin'
import { createServiceClient } from '@/lib/supabase/server'
import { SettingsForm, type TabKey } from '../SettingsForm'

const tabMap: Record<string, TabKey> = {
  scores: 'form',
  tiers: 'tiers',
  params: 'formula',
  kyc: 'kyc',
  cars: 'cars',
}

export default async function SettingsTabPage({
  params,
}: {
  params: Promise<{ tab: string }>
}) {
  await requireSuperAdmin()
  const { tab } = await params
  const initialTab = tabMap[tab]
  if (!initialTab) notFound()

  const service = await createServiceClient()

  const { data: configs } = await service
    .from('credit_score_config')
    .select('*')
    .order('config_key')

  const configMap = Object.fromEntries((configs ?? []).map((c: any) => [c.config_key, c.config_value]))

  return (
    <div>
      <div style={{ padding: '24px 40px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <h1 style={{ color: 'white', fontSize: 22, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>Assessment Settings</h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, lineHeight: 1.3 }}>Adjust scoring questions, tier thresholds, formula parameters, KYC fields, and cars. Changes apply to all new assessments.</p>
      </div>
      <div style={{ padding: '32px 40px' }}>
        <SettingsForm initialConfig={configMap} initialTab={initialTab} />
      </div>
    </div>
  )
}
