import { Link } from "@tanstack/react-router"
import { getMatchStatusConfig } from "@/lib/matchStatus"
import { PulsingDot } from "./PulsingDot"

interface MatchCardProps {
  id: string
  matchDate: string
  homeTeam: string
  awayTeam: string
  status: string
  homeScore?: number | null
  awayScore?: number | null
}

export function MatchCard({
  id,
  matchDate,
  homeTeam,
  awayTeam,
  status,
  homeScore,
  awayScore,
}: MatchCardProps) {
  const badge = getMatchStatusConfig(status)
  const date = new Date(matchDate)
  const dateStr = date.toLocaleDateString("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "short",
  })
  const timeStr = date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  })
  const isLive = status === "live"
  const showScore = status === "completed" || status === "live"

  return (
    <Link
      to="/matches/$matchId"
      params={{ matchId: id }}
      className="group block rounded-lg border border-border bg-card p-5 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] md:p-6"
    >
      {/* Top row: date + badge */}
      <div className="mb-4 flex items-center justify-between">
        <span className="font-body text-xs text-muted-foreground">
          {dateStr} · {timeStr}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium ${badge.cls}`}
        >
          {isLive && <PulsingDot />}
          {badge.text}
        </span>
      </div>

      {/* Teams + score */}
      <div className="flex items-center gap-4">
        {/* Home */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm text-primary-foreground"
            style={{ fontWeight: 900 }}
          >
            {homeTeam.charAt(0)}
          </span>
          <span
            className="truncate font-display text-sm tracking-tight md:text-base"
            style={{ fontWeight: 700 }}
          >
            {homeTeam}
          </span>
        </div>

        {/* Score / VS */}
        <div className="shrink-0 text-center">
          {showScore ? (
            <span
              className="font-display text-2xl tabular-nums md:text-3xl"
              style={{ fontWeight: 900 }}
            >
              {homeScore ?? 0}
              <span className="mx-1 text-border">-</span>
              {awayScore ?? 0}
            </span>
          ) : (
            <span
              className="font-display text-lg text-muted-foreground"
              style={{ fontWeight: 700 }}
            >
              VS
            </span>
          )}
        </div>

        {/* Away */}
        <div className="flex min-w-0 flex-1 flex-row-reverse items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-1 border-border bg-background font-display text-sm text-foreground"
            style={{ fontWeight: 900 }}
          >
            {awayTeam.charAt(0)}
          </span>
          <span
            className="truncate text-right font-display text-sm tracking-tight md:text-base"
            style={{ fontWeight: 700 }}
          >
            {awayTeam}
          </span>
        </div>
      </div>
    </Link>
  )
}
