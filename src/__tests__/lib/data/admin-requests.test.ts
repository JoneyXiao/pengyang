import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSingle = vi.fn()
const mockLimit = vi.fn(() => ({ single: mockSingle }))
const mockOrder = vi.fn(() => ({ limit: mockLimit, data: [], error: null }))
const mockEq = vi.fn(() => ({ order: mockOrder, single: mockSingle }))
const mockSelectResult = { eq: mockEq, order: mockOrder }
const mockSelect = vi.fn(() => mockSelectResult)
const mockInsert = vi.fn(() => ({ select: vi.fn(() => ({ single: mockSingle })) }))
const mockUpdate = vi.fn(() => ({ eq: mockEq }))
const mockFrom = vi.fn(() => ({
  select: mockSelect,
  insert: mockInsert,
  update: mockUpdate,
}))

const mockGetUser = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    from: mockFrom,
    auth: { getUser: mockGetUser },
  })),
}))

import {
  getMyAdminRequest,
  getPendingRequests,
  submitAdminRequest,
} from '@/lib/data/admin-requests'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getMyAdminRequest', () => {
  it('returns null when no user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const result = await getMyAdminRequest()
    expect(result).toBeNull()
  })

  it('returns request for authenticated user', async () => {
    const mockRequest = {
      id: 'req-1',
      user_id: 'user-1',
      status: 'pending',
      created_at: '2024-01-01',
      resolved_at: null,
      resolved_by: null,
    }

    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockSingle.mockResolvedValue({ data: mockRequest })

    const result = await getMyAdminRequest()
    expect(result).toEqual(mockRequest)
  })
})

describe('getPendingRequests', () => {
  it('returns empty array when no pending requests', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } })
    mockEq.mockReturnValue({
      order: vi.fn(() => ({ data: [], error: null })),
    })

    const result = await getPendingRequests()
    expect(result).toEqual([])
  })
})

describe('submitAdminRequest', () => {
  it('throws when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    await expect(submitAdminRequest()).rejects.toThrow('Not authenticated')
  })
})
