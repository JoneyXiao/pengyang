import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AdminRequestCard } from '@/components/dashboard/admin-request-card'
import type { AdminRequest } from '@/lib/types'

describe('AdminRequestCard', () => {
  it('renders pending status', () => {
    const request: AdminRequest = {
      id: 'req-1',
      user_id: 'user-1',
      status: 'pending',
      created_at: '2024-01-15T00:00:00Z',
      resolved_at: null,
      resolved_by: null,
    }

    render(<AdminRequestCard request={request} />)

    expect(screen.getByText(/申请审核中/)).toBeInTheDocument()
  })

  it('renders approved status', () => {
    const request: AdminRequest = {
      id: 'req-1',
      user_id: 'user-1',
      status: 'approved',
      created_at: '2024-01-15T00:00:00Z',
      resolved_at: '2024-01-16T00:00:00Z',
      resolved_by: 'admin-1',
    }

    render(<AdminRequestCard request={request} />)

    expect(screen.getByText(/申请已通过/)).toBeInTheDocument()
  })

  it('renders rejected status with resolved date', () => {
    const request: AdminRequest = {
      id: 'req-1',
      user_id: 'user-1',
      status: 'rejected',
      created_at: '2024-01-15T00:00:00Z',
      resolved_at: '2024-01-16T00:00:00Z',
      resolved_by: 'admin-1',
    }

    render(<AdminRequestCard request={request} />)

    expect(screen.getByText(/申请未通过/)).toBeInTheDocument()
    expect(screen.getByText(/处理时间/)).toBeInTheDocument()
  })
})
