'use server'

import { revalidatePath } from 'next/cache'
import { DASHBOARD } from '@/lib/constants/locale'
import {
  getMyAdminRequest,
  submitAdminRequest,
} from '@/lib/data/admin-requests'

type RequestState = { error?: string; success?: boolean } | null

export async function submitAdminRequestAction(_prevState: RequestState): Promise<RequestState> {
  // Check for existing pending request
  const existing = await getMyAdminRequest()
  if (existing && existing.status === 'pending') {
    return { error: DASHBOARD.requestAlreadyPending }
  }

  try {
    await submitAdminRequest()
  } catch {
    return { error: DASHBOARD.submitFailed }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
