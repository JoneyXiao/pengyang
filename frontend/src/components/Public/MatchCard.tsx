import { Link } from "@tanstack/react-router"
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

const statusConfig: Record<string, { text: string; cls: string }> = {
  upcoming: { text: "即将开始", cls: "bg-[#111111] text-white" },
  live: { text: "进行中", cls: "bg-[#FA5400] text-white" },
  completed: { text: "已结束", cls: "bg-[#F5F5F5] text-[#707072]" },
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
  const badge = statusConfig[status] ?? statusConfig.upcoming
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
      className="group block rounded-lg border border-[#E5E5E5] p-5 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] md:p-6"
    >
      {/* Top row: date + badge */}
      <div className="mb-4 flex items-center justify-between">
        <span className="font-body text-xs text-[#707072]">
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
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111111] font-display text-sm text-white"
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
              <span className="mx-1 text-[#E5E5E5]">-</span>
              {awayScore ?? 0}
            </span>
          ) : (
            <span
              className="font-display text-lg text-[#707072]"
              style={{ fontWeight: 700 }}
            >
              VS
            </span>
          )}
        </div>

        {/* Away */}
        <div className="flex min-w-0 flex-1 flex-row-reverse items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#E5E5E5] bg-white font-display text-sm text-[#111111]"
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
