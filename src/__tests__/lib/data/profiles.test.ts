import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSingle = vi.fn()
const mockSelect = vi.fn(() => ({ single: mockSingle, order: vi.fn(() => ({ data: [], error: null })) }))
const mockUpdate = vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn(() => ({ single: mockSingle })) })) }))
const mockEq = vi.fn(() => ({ single: mockSingle }))
const mockFrom = vi.fn(() => ({
  select: mockSelect,
  update: mockUpdate,
}))

const mockGetUser = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    from: mockFrom,
    auth: { getUser: mockGetUser },
  })),
}))

import { getCurrentProfile, getAllProfiles } from '@/lib/data/profiles'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getCurrentProfile', () => {
  it('returns null when no user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const result = await getCurrentProfile()
    expect(result).toBeNull()
  })

  it('returns profile for authenticated user', async () => {
    const mockProfile = {
      id: 'user-1',
      username: 'testuser',
      display_name: null,
      role: 'regular',
      avatar_url: '/images/default-avatar.svg',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    }

    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockSelect.mockReturnValue({ eq: mockEq })
    mockEq.mockReturnValue({ single: mockSingle })
    mockSingle.mockResolvedValue({ data: mockProfile })

    const result = await getCurrentProfile()
    expect(result).toEqual(mockProfile)
  })
})

describe('getAllProfiles', () => {
  it('returns empty array when no profiles', async () => {
    mockSelect.mockReturnValue({
      order: vi.fn(() => ({ data: [], error: null })),
    })

    const result = await getAllProfiles()
    expect(result).toEqual([])
  })

  it('throws on error', async () => {
    mockSelect.mockReturnValue({
      order: vi.fn(() => ({ data: null, error: new Error('DB error') })),
    })

    await expect(getAllProfiles()).rejects.toThrow()
  })
})
