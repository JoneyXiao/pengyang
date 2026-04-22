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

// Auth & Role Management

export type UserRole = 'regular' | 'admin' | 'super_admin'

export type RequestStatus = 'pending' | 'approved' | 'rejected'

export interface Profile {
  id: string
  username: string
  display_name: string | null
  role: UserRole
  avatar_url: string
  created_at: string
  updated_at: string
}

export interface AdminRequest {
  id: string
  user_id: string
  status: RequestStatus
  created_at: string
  resolved_at: string | null
  resolved_by: string | null
}

export interface AdminRequestWithProfile extends AdminRequest {
  profiles: Pick<Profile, 'username' | 'display_name' | 'avatar_url'>
}
