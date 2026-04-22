import { createClient } from '@/lib/supabase/server'
import { DASHBOARD, ROLES } from '@/lib/constants/locale'
import { getMyAdminRequest } from '@/lib/data/admin-requests'
import { AdminRequestCard } from '@/components/dashboard/admin-request-card'
import { RequestAdminButton } from '@/components/dashboard/request-admin-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const adminRequest = await getMyAdminRequest()
  const isRegular = profile?.role === 'regular'
  const canRequest =
    isRegular && (!adminRequest || adminRequest.status === 'rejected')
  const hasPending = isRegular && adminRequest?.status === 'pending'

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">{DASHBOARD.title}</h1>
      <p className="mt-2 text-muted-foreground">
        {DASHBOARD.greeting}，{profile?.display_name || profile?.username}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {ROLES[profile?.role ?? 'regular']}
      </p>

      {isRegular && (
        <div className="mt-6">
          {adminRequest && (hasPending || adminRequest.status === 'approved') && (
            <AdminRequestCard request={adminRequest} />
          )}
          {adminRequest?.status === 'rejected' && (
            <div className="space-y-3">
              <AdminRequestCard request={adminRequest} />
              <RequestAdminButton label={DASHBOARD.reRequest} />
            </div>
          )}
          {canRequest && !adminRequest && (
            <RequestAdminButton label={DASHBOARD.requestAdmin} />
          )}
        </div>
      )}
    </div>
  )
}
