import { Minus, Plus } from "lucide-react"
import type { MatchPublic } from "@/client"
import { PulsingDot } from "@/components/Public/PulsingDot"

export function LiveScoreWidget({
  match,
  onUpdateScore,
  onFinalize,
}: {
  match: MatchPublic | null
  onUpdateScore: (id: string, home: number, away: number) => void
  onFinalize: (id: string) => void
}) {
  const homeScore = match?.home_score ?? 0
  const awayScore = match?.away_score ?? 0

  return (
    <div className="flex flex-col rounded-lg border-2 border-[#E5E5E5] p-5 md:p-6 xl:col-span-1">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-[#111111]"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M3.33 16.67c0-1.47.58-2.87 1.63-3.92L12 5.71l7.04 7.04a5.55 5.55 0 0 1-7.85 7.85L7.25 16.67a5.55 5.55 0 0 0-3.92 0zM12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
          </svg>
          <h2
            className="font-display text-lg tracking-wide"
            style={{ fontWeight: 900 }}
          >
            实时比分
          </h2>
        </div>
        {match && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FA5400] px-3 py-1 text-[10px] font-semibold text-white">
            <PulsingDot />
            进行中
          </span>
        )}
      </div>

      {match ? (
        <div className="flex flex-1 flex-col">
          <div className="mb-1 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]">
              {match.home_team}（主场）
            </p>
          </div>
          <div className="mb-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                onUpdateScore(match.id, Math.max(0, homeScore - 1), awayScore)
              }
              className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-[#E5E5E5] transition-colors hover:border-[#111111] outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-1"
            >
              <Minus size={16} />
            </button>
            <span
              className="w-16 text-center font-display text-5xl tabular-nums"
              style={{ fontWeight: 900 }}
            >
              {homeScore}
            </span>
            <button
              type="button"
              onClick={() => onUpdateScore(match.id, homeScore + 1, awayScore)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-[#E5E5E5] transition-colors hover:border-[#111111] outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-1"
            >
              <Plus size={16} />
            </button>
          </div>

          <p
            className="mb-4 text-center font-display text-lg text-[#E5E5E5]"
            style={{ fontWeight: 900 }}
          >
            VS
          </p>

          <div className="mb-1 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]">
              {match.away_team}（客场）
            </p>
          </div>
          <div className="mb-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                onUpdateScore(match.id, homeScore, Math.max(0, awayScore - 1))
              }
              className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-[#E5E5E5] transition-colors hover:border-[#111111] outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-1"
            >
              <Minus size={16} />
            </button>
            <span
              className="w-16 text-center font-display text-5xl tabular-nums text-[#707072]"
              style={{ fontWeight: 900 }}
            >
              {awayScore}
            </span>
            <button
              type="button"
              onClick={() => onUpdateScore(match.id, homeScore, awayScore + 1)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-[#E5E5E5] transition-colors hover:border-[#111111] outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-1"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onFinalize(match.id)}
            className="mt-auto w-full rounded-[30px] border-2 border-[#111111] py-2.5 font-display text-xs tracking-wide transition-colors hover:bg-[#111111] hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
            style={{ fontWeight: 700 }}
          >
            结束比赛
          </button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center py-8">
          <p className="text-center text-sm text-[#707072]">暂无进行中的比赛</p>
          <p className="mt-1 text-center text-xs text-[#B0B0B0]">
            在比赛列表中点击"开始比赛"以启用实时比分
          </p>
        </div>
      )}
    </div>
  )
}
