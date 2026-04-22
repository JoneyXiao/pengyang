'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { demoteUser } from '@/lib/data/admin-requests'
import { ADMIN } from '@/lib/constants/locale'

const demoteSchema = z.object({
  user_id: z.string().uuid(),
})

type DemoteState = { error?: string; success?: boolean } | null

export async function demoteUserAction(_prevState: DemoteState, formData: FormData): Promise<DemoteState> {
  const raw = {
    user_id: formData.get('user_id') as string,
  }

  const result = demoteSchema.safeParse(raw)
  if (!result.success) {
    return { error: ADMIN.invalidUserId }
  }

  try {
    await demoteUser(result.data.user_id)
  } catch {
    return { error: ADMIN.operationFailed }
  }

  revalidatePath('/admin/users')
  return { success: true }
}
