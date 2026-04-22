'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { approveRequest, rejectRequest } from '@/lib/data/admin-requests'
import { ADMIN } from '@/lib/constants/locale'

const resolveSchema = z.object({
  request_id: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
})

type ResolveState = { error?: string; success?: boolean } | null

export async function resolveAdminRequest(_prevState: ResolveState, formData: FormData): Promise<ResolveState> {
  const raw = {
    request_id: formData.get('request_id') as string,
    action: formData.get('action') as string,
  }

  const result = resolveSchema.safeParse(raw)
  if (!result.success) {
    return { error: ADMIN.invalidRequest }
  }

  try {
    if (result.data.action === 'approve') {
      await approveRequest(result.data.request_id)
    } else {
      await rejectRequest(result.data.request_id)
    }
  } catch {
    return { error: ADMIN.operationFailed }
  }

  revalidatePath('/admin/requests')
  return { success: true }
}
