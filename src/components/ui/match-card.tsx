import Link from 'next/link'
import type { Match } from '@/lib/types'
import { StatusBadge } from '@/components/ui/status-badge'

interface MatchCardProps {
  match: Match
}

function getPengyangDisplay(match: Match) {
  if (match.isPengyangHome) {
    return {
      pengyangName: match.homeTeam,
      opponentName: match.awayTeam,
      pengyangScore: match.homeScore,
      opponentScore: match.awayScore,
    }
  }
  return {
    pengyangName: match.awayTeam,
    opponentName: match.homeTeam,
    pengyangScore: match.awayScore,
    opponentScore: match.homeScore,
  }
}

function formatMatchDate(dateTime: string): string {
  const date = new Date(dateTime)
  return date.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

function formatMatchTime(dateTime: string): string {
  const date = new Date(dateTime)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function MatchCard({ match }: MatchCardProps) {
  const { pengyangName, opponentName, pengyangScore, opponentScore } =
    getPengyangDisplay(match)
  const showScore = match.status === 'completed' || match.status === 'live'

  return (
    <Link
      href={`/matches/${match.id}`}
      className="group block rounded-2xl border border-border bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="flex items-center justify-between gap-2">
        <StatusBadge status={match.status} />
        <span className="text-xs text-muted-foreground">
          {formatMatchDate(match.dateTime)}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-base font-bold text-foreground">
          {pengyangName}
        </span>
        {showScore ? (
          <span className="font-mono text-2xl font-bold tracking-tight text-foreground">
            {pengyangScore} : {opponentScore}
          </span>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">VS</span>
        )}
        <span className="text-base font-bold text-foreground">
          {opponentName}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{match.venue}</span>
        <span>{formatMatchTime(match.dateTime)}</span>
      </div>
    </Link>
  )
}
