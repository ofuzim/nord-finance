import { requireSuperAdmin } from '@/lib/admin'
import { createServiceClient } from '@/lib/supabase/server'
import { InviteForm } from './InviteForm'
import { TeamActions } from './TeamActions'
import type { AdminRole } from '@/types/database'

const roleLabels: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  reviewer: 'Reviewer',
}

const roleColors: Record<AdminRole, string> = {
  super_admin: '#C39529',
  admin: '#38bdf8',
  reviewer: 'rgba(255,255,255,0.45)',
}

export default async function TeamPage() {
  const currentAdmin = await requireSuperAdmin()
  const service = await createServiceClient()

  const { data: admins } = await service
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <div>
      <div style={{ padding: '24px 40px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: 22, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>Team</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, lineHeight: 1.3 }}>Manage admin users and their access levels.</p>
        </div>
        <InviteForm />
      </div>
    <div style={{ padding: '32px 40px' }}>

      <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(admins ?? []).map((admin: any) => {
              const isYou = admin.id === currentAdmin.id
              return (
                <tr key={admin.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: admin.is_active ? 1 : 0.45 }}>
                  <td style={{ padding: '14px 20px', color: 'white', fontSize: 13 }}>
                    {admin.full_name} {isYou && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>(you)</span>}
                  </td>
                  <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{admin.email}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ color: roleColors[admin.role as AdminRole], fontSize: 11, fontWeight: 600 }}>{roleLabels[admin.role as AdminRole]}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ color: admin.is_active ? '#22c55e' : 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 600 }}>
                      {admin.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                    {new Date(admin.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    {!isYou && (
                      <TeamActions adminId={admin.id} currentRole={admin.role} isActive={admin.is_active} />
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}
