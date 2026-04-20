import type { Match } from '@/lib/types'
import matchesData from '@/data/fixtures/matches.json'

const matches: Match[] = matchesData as Match[]

export async function getUpcomingMatches(limit = 3): Promise<Match[]> {
  return matches
    .filter((m) => m.status === 'upcoming')
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, limit)
}

export async function getRecentResults(limit = 3): Promise<Match[]> {
  return matches
    .filter((m) => m.status === 'completed')
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
    .slice(0, limit)
}

export async function getLiveMatches(): Promise<Match[]> {
  return matches
    .filter((m) => m.status === 'live')
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
}
