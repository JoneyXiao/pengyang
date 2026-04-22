import { getPendingRequests } from '@/lib/data/admin-requests'
import { AdminRequestList } from '@/components/dashboard/admin-request-list'
import { ADMIN } from '@/lib/constants/locale'

export default async function AdminRequestsPage() {
  const requests = await getPendingRequests()

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">{ADMIN.requestsTitle}</h1>
      <div className="mt-6">
        <AdminRequestList requests={requests} />
      </div>
    </div>
  )
}
