import { Minus, Plus } from "lucide-react"
import { TbBroadcast } from "react-icons/tb"
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
    <div className="flex flex-col rounded-lg border-1 border-border bg-card p-5 md:p-6 xl:col-span-1">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TbBroadcast className="size-5 text-foreground" />
          <h2
            className="font-display text-lg tracking-wide"
            style={{ fontWeight: 900 }}
          >
            实时比分
          </h2>
        </div>
        {match && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[10px] font-semibold text-secondary-foreground">
            <PulsingDot />
            进行中
          </span>
        )}
      </div>

      {match ? (
        <div className="flex flex-1 flex-col mt-6">
          <div className="mb-1 text-center">
            <p className="text-[16px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              {match.home_team}（主场）
            </p>
          </div>
          <div className="mb-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                onUpdateScore(match.id, Math.max(0, homeScore - 1), awayScore)
              }
              className="flex h-11 w-11 items-center justify-center rounded-lg border-1 border-border transition-colors hover:border-ring hover:bg-muted outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
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
              className="flex h-11 w-11 items-center justify-center rounded-lg border-1 border-border transition-colors hover:border-ring hover:bg-muted outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
            >
              <Plus size={16} />
            </button>
          </div>

          <p
            className="mb-4 text-center font-display text-5xl text-border"
            style={{ fontWeight: 900 }}
          >
            VS
          </p>

          <div className="mb-1 text-center">
            <p className="text-[16px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              {match.away_team}（客场）
            </p>
          </div>
          <div className="mb-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                onUpdateScore(match.id, homeScore, Math.max(0, awayScore - 1))
              }
              className="flex h-11 w-11 items-center justify-center rounded-lg border-1 border-border transition-colors hover:border-ring hover:bg-muted outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
            >
              <Minus size={16} />
            </button>
            <span
              className="w-16 text-center font-display text-5xl tabular-nums text-muted-foreground"
              style={{ fontWeight: 900 }}
            >
              {awayScore}
            </span>
            <button
              type="button"
              onClick={() => onUpdateScore(match.id, homeScore, awayScore + 1)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border-1 border-border transition-colors hover:border-ring hover:bg-muted outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onFinalize(match.id)}
            className="mt-auto w-full rounded-[30px] border-1 border-muted-foreground py-2.5 font-display text-xs tracking-wide text-muted-foreground transition-colors hover:bg-muted-foreground hover:text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{ fontWeight: 700 }}
          >
            结束比赛
          </button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center py-8">
          <p className="text-center text-sm text-muted-foreground">
            暂无进行中的比赛
          </p>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            在比赛列表中点击"开始比赛"以启用实时比分
          </p>
        </div>
      )}
    </div>
  )
}
