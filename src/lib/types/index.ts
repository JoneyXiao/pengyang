export type MatchStatus = 'upcoming' | 'live' | 'completed' | 'cancelled'

export interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  dateTime: string // ISO 8601
  venue: string
  status: MatchStatus
  homeScore: number | null
  awayScore: number | null
  isPengyangHome: boolean
}

export interface TeamProfile {
  name: string
  fullName: string
  tagline: string
  description: string
  heroImageUrl: string | null
  heroImageAlt: string
  teamPhotoUrl: string | null
  teamPhotoAlt: string
  badgeUrl: string
  contactAddress: string
  contactEmail: string
}

export interface NavItem {
  label: string
  href: string
  isExternal?: boolean
}
