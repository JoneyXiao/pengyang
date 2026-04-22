'use client'

import { useActionState } from 'react'
import { resolveAdminRequest } from '@/app/(protected)/admin/requests/actions'
import { ADMIN } from '@/lib/constants/locale'
import { Button } from '@/components/ui/button'
import type { AdminRequestWithProfile } from '@/lib/types'

function RequestItem({ request }: { request: AdminRequestWithProfile }) {
  const [, formAction, isPending] = useActionState(resolveAdminRequest, null)

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <p className="font-medium">
          {request.profiles.display_name || request.profiles.username}
        </p>
        <p className="text-sm text-muted-foreground">
          @{request.profiles.username}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(request.created_at).toLocaleDateString('zh-CN')}
        </p>
      </div>
      <div className="flex gap-2">
        <form action={formAction}>
          <input type="hidden" name="request_id" value={request.id} />
          <input type="hidden" name="action" value="approve" />
          <Button size="sm" disabled={isPending}>
            {ADMIN.approve}
          </Button>
        </form>
        <form action={formAction}>
          <input type="hidden" name="request_id" value={request.id} />
          <input type="hidden" name="action" value="reject" />
          <Button size="sm" variant="outline" disabled={isPending}>
            {ADMIN.reject}
          </Button>
        </form>
      </div>
    </div>
  )
}

export function AdminRequestList({
  requests,
}: {
  requests: AdminRequestWithProfile[]
}) {
  if (requests.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{ADMIN.noRequests}</p>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <RequestItem key={request.id} request={request} />
      ))}
    </div>
  )
}
