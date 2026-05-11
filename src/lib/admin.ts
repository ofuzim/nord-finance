import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { AdminUser } from '@/types/database'

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .eq('is_active', true)
      .maybeSingle()

    return (data as AdminUser) ?? null
  } catch {
    return null
  }
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getCurrentAdmin()
  if (!admin) redirect('/admin/login')
  return admin
}

export async function requireSuperAdmin(): Promise<AdminUser> {
  const admin = await requireAdmin()
  if (admin.role !== 'super_admin') redirect('/admin/dashboard')
  return admin
}
