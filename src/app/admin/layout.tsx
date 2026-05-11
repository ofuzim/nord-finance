import { getCurrentAdmin } from '@/lib/admin'
import { AdminSidebar } from './AdminSidebar'
import { NavigationProgress } from '@/components/NavigationProgress'
import type { AdminUser } from '@/types/database'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin()

  if (!admin) {
    return (
      <div style={{ backgroundColor: '#000', minHeight: '100vh' }}>
        {children}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#000' }}>
      <NavigationProgress />
      <AdminSidebar admin={admin as AdminUser} />
      <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', height: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
