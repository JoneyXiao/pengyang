'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { registerSchema } from '@/lib/validations/auth'
import { AUTH } from '@/lib/constants/locale'

type RegisterState = {
  error?: {
    email?: string[]
    username?: string[]
    password?: string[]
  }
} | null

export async function registerUser(_prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const raw = {
    email: formData.get('email') as string,
    username: formData.get('username') as string,
    password: formData.get('password') as string,
  }

  const result = registerSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        username: result.data.username,
      },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: { email: [AUTH.loginError] } }
    }
    return { error: { email: [AUTH.loginError] } }
  }

  redirect('/login?registered=true')
}
