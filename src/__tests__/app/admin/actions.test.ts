import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

const mockApproveRequest = vi.fn()
const mockRejectRequest = vi.fn()
const mockDemoteUser = vi.fn()

vi.mock('@/lib/data/admin-requests', () => ({
  approveRequest: (...args: unknown[]) => mockApproveRequest(...args),
  rejectRequest: (...args: unknown[]) => mockRejectRequest(...args),
  demoteUser: (...args: unknown[]) => mockDemoteUser(...args),
}))

import { resolveAdminRequest } from '@/app/(protected)/admin/requests/actions'
import { demoteUserAction } from '@/app/(protected)/admin/users/actions'

function makeFormData(data: Record<string, string>) {
  const fd = new FormData()
  Object.entries(data).forEach(([k, v]) => fd.set(k, v))
  return fd
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('resolveAdminRequest', () => {
  it('returns error for invalid request_id', async () => {
    const result = await resolveAdminRequest(
      null,
      makeFormData({ request_id: 'not-a-uuid', action: 'approve' })
    )

    expect(result?.error).toBeDefined()
  })

  it('calls approveRequest on approve action', async () => {
    mockApproveRequest.mockResolvedValue(undefined)

    const result = await resolveAdminRequest(
      null,
      makeFormData({
        request_id: '550e8400-e29b-41d4-a716-446655440000',
        action: 'approve',
      })
    )

    expect(mockApproveRequest).toHaveBeenCalledWith(
      '550e8400-e29b-41d4-a716-446655440000'
    )
    expect(result?.success).toBe(true)
  })

  it('calls rejectRequest on reject action', async () => {
    mockRejectRequest.mockResolvedValue(undefined)

    const result = await resolveAdminRequest(
      null,
      makeFormData({
        request_id: '550e8400-e29b-41d4-a716-446655440000',
        action: 'reject',
      })
    )

    expect(mockRejectRequest).toHaveBeenCalledWith(
      '550e8400-e29b-41d4-a716-446655440000'
    )
    expect(result?.success).toBe(true)
  })

  it('returns error on failure', async () => {
    mockApproveRequest.mockRejectedValue(new Error('DB error'))

    const result = await resolveAdminRequest(
      null,
      makeFormData({
        request_id: '550e8400-e29b-41d4-a716-446655440000',
        action: 'approve',
      })
    )

    expect(result?.error).toBeDefined()
  })
})

describe('demoteUserAction', () => {
  it('returns error for invalid user_id', async () => {
    const result = await demoteUserAction(
      null,
      makeFormData({ user_id: 'not-a-uuid' })
    )

    expect(result?.error).toBeDefined()
  })

  it('calls demoteUser on valid input', async () => {
    mockDemoteUser.mockResolvedValue(undefined)

    const result = await demoteUserAction(
      null,
      makeFormData({ user_id: '550e8400-e29b-41d4-a716-446655440000' })
    )

    expect(mockDemoteUser).toHaveBeenCalledWith(
      '550e8400-e29b-41d4-a716-446655440000'
    )
    expect(result?.success).toBe(true)
  })
})
