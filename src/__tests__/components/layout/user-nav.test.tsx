import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserNav } from '@/components/layout/user-nav'

vi.mock('@/app/(auth)/logout/actions', () => ({
  logoutUser: vi.fn(),
}))

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => <img {...props} />,
}))

const mockUseAuth = vi.fn()
vi.mock('@/components/auth/auth-provider', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('UserNav', () => {
  it('renders login button when not authenticated', () => {
    mockUseAuth.mockReturnValue({ user: null, profile: null, isLoading: false })

    render(<UserNav />)

    expect(screen.getByRole('button', { name: /登录/ })).toBeInTheDocument()
  })

  it('renders nothing when loading', () => {
    mockUseAuth.mockReturnValue({ user: null, profile: null, isLoading: true })

    const { container } = render(<UserNav />)

    expect(container.innerHTML).toBe('')
  })

  it('renders dashboard and profile links for regular user', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'user-1' },
      profile: {
        username: 'testuser',
        display_name: 'Test',
        role: 'regular',
        avatar_url: '/images/default-avatar.svg',
      },
      isLoading: false,
    })

    render(<UserNav />)

    expect(screen.getByRole('button', { name: /控制面板/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /个人资料/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /退出登录/ })).toBeInTheDocument()
  })

  it('renders admin links for super_admin', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'admin-1' },
      profile: {
        username: 'admin',
        display_name: 'Admin',
        role: 'super_admin',
        avatar_url: '/images/default-avatar.svg',
      },
      isLoading: false,
    })

    render(<UserNav />)

    expect(screen.getByRole('button', { name: /管理员申请/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /用户管理/ })).toBeInTheDocument()
  })

  it('renders content management for admin role', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'admin-1' },
      profile: {
        username: 'admin',
        display_name: 'Admin',
        role: 'admin',
        avatar_url: '/images/default-avatar.svg',
      },
      isLoading: false,
    })

    render(<UserNav />)

    expect(screen.getByRole('button', { name: /内容管理/ })).toBeInTheDocument()
  })
})
