'use server'

import { revalidatePath } from 'next/cache'
import { profileSchema } from '@/lib/validations/auth'
import { updateProfile } from '@/lib/data/profiles'
import { PROFILE } from '@/lib/constants/locale'

type ProfileState = {
  error?: {
    username?: string[]
    display_name?: string[]
    form?: string[]
  }
  success?: boolean
} | null

export async function updateProfileAction(_prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  const raw = {
    username: formData.get('username') as string || undefined,
    display_name: (formData.get('display_name') as string) || null,
  }

  const result = profileSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  try {
    await updateProfile(result.data)
  } catch (e) {
    const message = e instanceof Error ? e.message : PROFILE.saveFailed
    return { error: { form: [message] } }
  }

  revalidatePath('/profile')
  return { success: true }
}
