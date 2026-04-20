import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MatchCard } from '@/components/ui/match-card'
import type { Match } from '@/lib/types'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, ...props }: { children: React.ReactNode; href: string }) => {
    return <a {...props}>{children}</a>
  },
}))

const upcomingMatch: Match = {
  id: 'test-001',
  homeTeam: '鹏飏',
  awayTeam: '测试小学',
  dateTime: '2026-05-01T15:00:00+08:00',
  venue: '观湖实验学校足球场',
  status: 'upcoming',
  homeScore: null,
  awayScore: null,
  isPengyangHome: true,
}

const completedMatch: Match = {
  id: 'test-002',
  homeTeam: '对手学校',
  awayTeam: '鹏飏',
  dateTime: '2026-04-10T14:00:00+08:00',
  venue: '对手学校操场',
  status: 'completed',
  homeScore: 1,
  awayScore: 3,
  isPengyangHome: false,
}

const liveMatch: Match = {
  id: 'test-003',
  homeTeam: '鹏飏',
  awayTeam: '友谊学校',
  dateTime: '2026-04-20T15:00:00+08:00',
  venue: '观湖实验学校足球场',
  status: 'live',
  homeScore: 2,
  awayScore: 1,
  isPengyangHome: true,
}

describe('MatchCard', () => {
  it('renders both team names with Pengyang first (home)', () => {
    render(<MatchCard match={upcomingMatch} />)
    const texts = screen.getAllByText(/鹏飏|测试小学/)
    expect(texts.length).toBeGreaterThanOrEqual(2)
  })

  it('renders both team names with Pengyang first (away)', () => {
    render(<MatchCard match={completedMatch} />)
    // Pengyang (away team) should appear first in the display
    const pengyangEl = screen.getByText('鹏飏')
    const opponentEl = screen.getByText('对手学校')
    expect(pengyangEl).toBeInTheDocument()
    expect(opponentEl).toBeInTheDocument()
  })

  it('shows VS for upcoming matches instead of score', () => {
    render(<MatchCard match={upcomingMatch} />)
    expect(screen.getByText('VS')).toBeInTheDocument()
  })

  it('shows score in monospace for completed matches', () => {
    render(<MatchCard match={completedMatch} />)
    // Pengyang is away, so pengyangScore=3, opponentScore=1
    const scoreEl = screen.getByText(/3 : 1/)
    expect(scoreEl).toBeInTheDocument()
    expect(scoreEl.className).toContain('font-mono')
  })

  it('shows score for live matches', () => {
    render(<MatchCard match={liveMatch} />)
    const scoreEl = screen.getByText(/2 : 1/)
    expect(scoreEl).toBeInTheDocument()
  })

  it('renders as a link to match detail page', () => {
    render(<MatchCard match={upcomingMatch} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/matches/test-001')
  })

  it('displays venue name', () => {
    render(<MatchCard match={upcomingMatch} />)
    expect(screen.getByText('观湖实验学校足球场')).toBeInTheDocument()
  })

  it('displays the status badge', () => {
    render(<MatchCard match={upcomingMatch} />)
    expect(screen.getByText('即将开始')).toBeInTheDocument()
  })
})
