import type { TeamProfile } from '@/lib/types'
import teamData from '@/data/fixtures/team.json'

export async function getTeamProfile(): Promise<TeamProfile> {
  return teamData as TeamProfile
}
