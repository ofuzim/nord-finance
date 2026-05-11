'use client'

import { useState } from 'react'
import { updateAdminUser } from '@/app/actions/admin'
import type { AdminRole } from '@/types/database'

export function TeamActions({
  adminId,
  currentRole,
  isActive,
}: {
  adminId: string
  currentRole: AdminRole
  isActive: boolean
}) {
  const [loading, setLoading] = useState(false)

  const handleRoleChange = async (role: AdminRole) => {
    setLoading(true)
    await updateAdminUser({ adminId, role })
    setLoading(false)
  }

  const handleToggleActive = async () => {
    if (!confirm(`${isActive ? 'Deactivate' : 'Reactivate'} this admin?`)) return
    setLoading(true)
    await updateAdminUser({ adminId, isActive: !isActive })
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <select
        defaultValue={currentRole}
        onChange={e => handleRoleChange(e.target.value as AdminRole)}
        disabled={loading}
        style={{
          backgroundColor: 'rgba(255,255,255,0.055)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 6,
          padding: '6px 10px',
          color: 'rgba(255,255,255,0.7)',
          fontFamily: "'Poppins', sans-serif",
          fontSize: 11,
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        <option value="reviewer">Reviewer</option>
        <option value="admin">Admin</option>
        <option value="super_admin">Super Admin</option>
      </select>

      <button
        onClick={handleToggleActive}
        disabled={loading}
        style={{
          backgroundColor: 'transparent',
          border: `1px solid ${isActive ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
          borderRadius: 6,
          padding: '6px 10px',
          color: isActive ? '#ef4444' : '#22c55e',
          fontSize: 11,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.5 : 1,
          whiteSpace: 'nowrap',
        }}
      >
        {isActive ? 'Deactivate' : 'Reactivate'}
      </button>
    </div>
  )
}
