import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProfileForm } from '@/components/profile/profile-form'
import type { Profile } from '@/lib/types'

vi.mock('@/app/(protected)/profile/actions', () => ({
  updateProfileAction: vi.fn(),
}))

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

const mockProfile: Profile = {
  id: 'user-1',
  username: 'testuser',
  display_name: 'Test User',
  role: 'regular',
  avatar_url: '/images/default-avatar.svg',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
}

describe('ProfileForm', () => {
  it('renders username field with current value', () => {
    render(<ProfileForm profile={mockProfile} />)

    const usernameInput = screen.getByLabelText(/用户名/)
    expect(usernameInput).toHaveValue('testuser')
  })

  it('renders display name field with current value', () => {
    render(<ProfileForm profile={mockProfile} />)

    const displayInput = screen.getByLabelText(/显示名称/)
    expect(displayInput).toHaveValue('Test User')
  })

  it('renders avatar image', () => {
    render(<ProfileForm profile={mockProfile} />)

    const img = screen.getByAltText(/头像/)
    expect(img).toHaveAttribute('src', '/images/default-avatar.svg')
  })

  it('renders save button', () => {
    render(<ProfileForm profile={mockProfile} />)

    expect(screen.getByRole('button', { name: /保存/ })).toBeInTheDocument()
  })
})
