import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AdminRequestList } from '@/components/dashboard/admin-request-list'
import type { AdminRequestWithProfile } from '@/lib/types'

vi.mock('@/app/(protected)/admin/requests/actions', () => ({
  resolveAdminRequest: vi.fn(),
}))

const mockRequests: AdminRequestWithProfile[] = [
  {
    id: 'req-1',
    user_id: 'user-1',
    status: 'pending',
    created_at: '2024-01-01T00:00:00Z',
    resolved_at: null,
    resolved_by: null,
    profiles: {
      username: 'testuser',
      display_name: 'Test User',
      avatar_url: '/images/default-avatar.svg',
    },
  },
]

describe('AdminRequestList', () => {
  it('renders empty state when no requests', () => {
    render(<AdminRequestList requests={[]} />)

    expect(screen.getByText(/暂无待处理的申请/)).toBeInTheDocument()
  })

  it('renders request with username', () => {
    render(<AdminRequestList requests={mockRequests} />)

    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('@testuser')).toBeInTheDocument()
  })

  it('renders approve and reject buttons', () => {
    render(<AdminRequestList requests={mockRequests} />)

    expect(screen.getByRole('button', { name: /批准/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /拒绝/ })).toBeInTheDocument()
  })
})
