import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`)
  }),
}))

const mockSignUp = vi.fn()
const mockSignIn = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      signUp: mockSignUp,
      signInWithPassword: mockSignIn,
    },
  })),
}))

import { registerUser } from '@/app/(auth)/register/actions'
import { loginUser } from '@/app/(auth)/login/actions'

function makeFormData(data: Record<string, string>) {
  const fd = new FormData()
  Object.entries(data).forEach(([k, v]) => fd.set(k, v))
  return fd
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('registerUser', () => {
  it('returns field errors for invalid input', async () => {
    const result = await registerUser(
      null,
      makeFormData({ email: 'bad', username: 'a', password: '123' })
    )

    expect(result?.error).toBeDefined()
  })

  it('redirects on successful registration', async () => {
    mockSignUp.mockResolvedValue({ error: null })

    await expect(
      registerUser(
        null,
        makeFormData({
          email: 'user@test.com',
          username: 'testuser',
          password: '12345678',
        })
      )
    ).rejects.toThrow('REDIRECT:/login?registered=true')
  })

  it('returns error when email already registered', async () => {
    mockSignUp.mockResolvedValue({
      error: { message: 'User already registered' },
    })

    const result = await registerUser(
      null,
      makeFormData({
        email: 'user@test.com',
        username: 'testuser',
        password: '12345678',
      })
    )

    expect(result?.error?.email).toBeDefined()
  })
})

describe('loginUser', () => {
  it('returns field errors for invalid input', async () => {
    const result = await loginUser(
      null,
      makeFormData({ email: 'bad', password: '' })
    )

    expect(result?.error).toBeDefined()
  })

  it('redirects on successful login', async () => {
    mockSignIn.mockResolvedValue({ error: null })

    await expect(
      loginUser(
        null,
        makeFormData({ email: 'user@test.com', password: 'password123' })
      )
    ).rejects.toThrow('REDIRECT:/dashboard')
  })

  it('returns generic error on wrong credentials', async () => {
    mockSignIn.mockResolvedValue({
      error: { message: 'Invalid login credentials' },
    })

    const result = await loginUser(
      null,
      makeFormData({ email: 'user@test.com', password: 'wrongpassword' })
    )

    expect(result?.error?.form).toContain('邮箱或密码错误')
  })
})
