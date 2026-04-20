import { describe, it, expect } from 'vitest'
import { getUpcomingMatches, getRecentResults, getLiveMatches } from '@/lib/data/matches'

describe('getUpcomingMatches', () => {
  it('returns only upcoming matches', async () => {
    const matches = await getUpcomingMatches()
    expect(matches.length).toBeGreaterThan(0)
    matches.forEach((m) => expect(m.status).toBe('upcoming'))
  })

  it('returns matches sorted by date ascending (nearest first)', async () => {
    const matches = await getUpcomingMatches()
    for (let i = 1; i < matches.length; i++) {
      expect(new Date(matches[i].dateTime).getTime()).toBeGreaterThanOrEqual(
        new Date(matches[i - 1].dateTime).getTime()
      )
    }
  })

  it('respects the limit parameter', async () => {
    const matches = await getUpcomingMatches(1)
    expect(matches.length).toBeLessThanOrEqual(1)
  })

  it('defaults to limit of 3', async () => {
    const matches = await getUpcomingMatches()
    expect(matches.length).toBeLessThanOrEqual(3)
  })
})

describe('getRecentResults', () => {
  it('returns only completed matches', async () => {
    const matches = await getRecentResults()
    expect(matches.length).toBeGreaterThan(0)
    matches.forEach((m) => expect(m.status).toBe('completed'))
  })

  it('returns matches sorted by date descending (most recent first)', async () => {
    const matches = await getRecentResults()
    for (let i = 1; i < matches.length; i++) {
      expect(new Date(matches[i].dateTime).getTime()).toBeLessThanOrEqual(
        new Date(matches[i - 1].dateTime).getTime()
      )
    }
  })

  it('respects the limit parameter', async () => {
    const matches = await getRecentResults(2)
    expect(matches.length).toBeLessThanOrEqual(2)
  })
})

describe('getLiveMatches', () => {
  it('returns only live matches', async () => {
    const matches = await getLiveMatches()
    matches.forEach((m) => expect(m.status).toBe('live'))
  })

  it('returns an array (may be empty)', async () => {
    const matches = await getLiveMatches()
    expect(Array.isArray(matches)).toBe(true)
  })
})
