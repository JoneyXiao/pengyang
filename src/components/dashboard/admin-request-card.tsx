import { DASHBOARD } from '@/lib/constants/locale'
import type { AdminRequest } from '@/lib/types'

const statusStyles: Record<string, string> = {
  pending: 'border-yellow-200 bg-yellow-50 text-yellow-800',
  approved: 'border-green-200 bg-green-50 text-green-800',
  rejected: 'border-red-200 bg-red-50 text-red-800',
}

const statusLabels: Record<string, string> = {
  pending: DASHBOARD.requestPending,
  approved: DASHBOARD.requestApproved,
  rejected: DASHBOARD.requestRejected,
}

export function AdminRequestCard({ request }: { request: AdminRequest }) {
  return (
    <div
      className={`rounded-lg border p-4 ${statusStyles[request.status] ?? ''}`}
    >
      <p className="font-medium">{statusLabels[request.status]}</p>
      <p className="mt-1 text-xs">
        {DASHBOARD.submittedAt}：
        {new Date(request.created_at).toLocaleDateString('zh-CN')}
      </p>
      {request.resolved_at && (
        <p className="text-xs">
          {DASHBOARD.resolvedAt}：
          {new Date(request.resolved_at).toLocaleDateString('zh-CN')}
        </p>
      )}
    </div>
  )
}
