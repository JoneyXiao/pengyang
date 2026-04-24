import { Link } from "@tanstack/react-router"

interface MatchCardProps {
  id: string
  matchDate: string
  homeTeam: string
  awayTeam: string
  status: string
  homeScore?: number | null
  awayScore?: number | null
}

const statusLabel: Record<string, { text: string; color: string }> = {
  upcoming: { text: "即将开始", color: "bg-[#111111] text-white" },
  live: { text: "进行中", color: "bg-[#FA5400] text-white" },
  completed: { text: "已结束", color: "bg-[#F5F5F5] text-[#707072]" },
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
  const badge = statusLabel[status] ?? statusLabel.upcoming
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

  return (
    <Link
      to="/matches/$matchId"
      params={{ matchId: id }}
      className="group block rounded-lg border border-[#E5E5E5] p-5 transition-transform hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className="text-xs text-[#707072]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {dateStr} · {timeStr}
        </span>
        <span
          className={`rounded-full px-3 py-0.5 text-xs font-medium ${badge.color}`}
        >
          {badge.text}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <span
          className="flex-1 text-base truncate"
          style={{ fontFamily: "Jost, sans-serif", fontWeight: 700 }}
        >
          {homeTeam}
        </span>
        {status === "completed" || status === "live" ? (
          <span
            className="text-2xl tabular-nums"
            style={{ fontFamily: "Jost, sans-serif", fontWeight: 900 }}
          >
            {homeScore ?? 0} – {awayScore ?? 0}
          </span>
        ) : (
          <span
            className="text-lg text-[#707072]"
            style={{ fontFamily: "Jost, sans-serif", fontWeight: 700 }}
          >
            VS
          </span>
        )}
        <span
          className="flex-1 text-right text-base truncate"
          style={{ fontFamily: "Jost, sans-serif", fontWeight: 700 }}
        >
          {awayTeam}
        </span>
      </div>
    </Link>
  )
}
