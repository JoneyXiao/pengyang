import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const mockUser = vi.fn()
const mockProfileQuery = vi.fn()

vi.mock('@/lib/supabase/middleware', () => ({
  updateSession: vi.fn(async () => {
    const user = mockUser()
    return {
      user,
      response: { headers: new Headers() },
      supabase: {
        from: () => ({
          select: () => ({
            eq: () => ({
              single: mockProfileQuery,
            }),
          }),
        }),
      },
    }
  }),
}))

import { middleware } from '@/middleware'

function makeRequest(pathname: string) {
  const url = new URL(`http://localhost:3000${pathname}`)
  return new NextRequest(url)
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Access Control — Unauthenticated', () => {
  beforeEach(() => {
    mockUser.mockReturnValue(null)
  })

  it('redirects unauthenticated user from /dashboard to /login', async () => {
    const response = await middleware(makeRequest('/dashboard'))

    expect(response.status).toBe(307)
    expect(new URL(response.headers.get('location')!).pathname).toBe('/login')
  })

  it('redirects unauthenticated user from /profile to /login', async () => {
    const response = await middleware(makeRequest('/profile'))

    expect(response.status).toBe(307)
    expect(new URL(response.headers.get('location')!).pathname).toBe('/login')
  })

  it('redirects unauthenticated user from /admin/requests to /login', async () => {
    const response = await middleware(makeRequest('/admin/requests'))

    expect(response.status).toBe(307)
    expect(new URL(response.headers.get('location')!).pathname).toBe('/login')
  })

  it('redirects unauthenticated user from /admin/users to /login', async () => {
    const response = await middleware(makeRequest('/admin/users'))

    expect(response.status).toBe(307)
    expect(new URL(response.headers.get('location')!).pathname).toBe('/login')
  })
})

describe('Access Control — Regular User', () => {
  beforeEach(() => {
    mockUser.mockReturnValue({ sub: 'user-1' })
    mockProfileQuery.mockResolvedValue({ data: { role: 'regular' } })
  })

  it('allows regular user to access /dashboard', async () => {
    const response = await middleware(makeRequest('/dashboard'))

    // Not a redirect (302/307)
    expect(response.status).not.toBe(307)
  })

  it('allows regular user to access /profile', async () => {
    const response = await middleware(makeRequest('/profile'))

    expect(response.status).not.toBe(307)
  })

  it('redirects regular user from /admin/requests to /dashboard', async () => {
    const response = await middleware(makeRequest('/admin/requests'))

    expect(response.status).toBe(307)
    expect(new URL(response.headers.get('location')!).pathname).toBe(
      '/dashboard'
    )
  })

  it('redirects regular user from /admin/users to /dashboard', async () => {
    const response = await middleware(makeRequest('/admin/users'))

    expect(response.status).toBe(307)
    expect(new URL(response.headers.get('location')!).pathname).toBe(
      '/dashboard'
    )
  })
})

describe('Access Control — Super Admin', () => {
  beforeEach(() => {
    mockUser.mockReturnValue({ sub: 'admin-1' })
    mockProfileQuery.mockResolvedValue({ data: { role: 'super_admin' } })
  })

  it('allows super_admin to access /dashboard', async () => {
    const response = await middleware(makeRequest('/dashboard'))

    expect(response.status).not.toBe(307)
  })

  it('allows super_admin to access /profile', async () => {
    const response = await middleware(makeRequest('/profile'))

    expect(response.status).not.toBe(307)
  })

  it('allows super_admin to access /admin/requests', async () => {
    const response = await middleware(makeRequest('/admin/requests'))

    expect(response.status).not.toBe(307)
  })

  it('allows super_admin to access /admin/users', async () => {
    const response = await middleware(makeRequest('/admin/users'))

    expect(response.status).not.toBe(307)
  })

  it('redirects authenticated super_admin from /login to /dashboard', async () => {
    const response = await middleware(makeRequest('/login'))

    expect(response.status).toBe(307)
    expect(new URL(response.headers.get('location')!).pathname).toBe(
      '/dashboard'
    )
  })
})
