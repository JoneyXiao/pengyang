import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { PublicService } from "@/client"
import { MatchTimeline } from "@/components/Public/MatchTimeline"
import { MediaGallery } from "@/components/Public/MediaGallery"
import { PulsingDot } from "@/components/Public/PulsingDot"

export const Route = createFileRoute("/_public/matches/$matchId")({
  component: MatchDetailPage,
  head: () => ({
    meta: [{ title: "比赛详情 - 鹏飏足球" }],
  }),
})

const STATUS_CONFIG: Record<string, { text: string; cls: string }> = {
  upcoming: { text: "即将开始", cls: "bg-[#111111] text-white" },
  live: { text: "LIVE", cls: "bg-[#FA5400] text-white" },
  completed: { text: "已结束", cls: "bg-[#F5F5F5] text-[#707072]" },
}

function MatchDetailPage() {
  const { matchId } = Route.useParams()

  const { data: match, isLoading } = useQuery({
    queryKey: ["public-match-detail", matchId],
    queryFn: () => PublicService.getMatchDetail({ matchId }),
  })

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
        <div className="space-y-6">
          <div className="h-48 animate-pulse rounded-lg bg-[#F5F5F5]" />
          <div className="h-64 animate-pulse rounded-lg bg-[#F5F5F5]" />
        </div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center md:px-8">
        <p className="font-body text-lg text-[#707072]">比赛不存在</p>
      </div>
    )
  }

  const badge = STATUS_CONFIG[match.status] ?? STATUS_CONFIG.upcoming
  const date = new Date(match.match_date)
  const isLive = match.status === "live"
  const showScore = match.status === "completed" || match.status === "live"

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
      {/* Match header card */}
      <div className="mb-10 overflow-hidden rounded-lg border border-[#E5E5E5]">
        {/* Top bar with badge + date */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] px-5 py-3 md:px-8">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badge.cls}`}
          >
            {isLive && <PulsingDot />}
            {badge.text}
          </span>
          <span className="font-body text-xs text-[#707072] md:text-sm">
            {date.toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "short",
            })}
            {" · "}
            {date.toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Score area */}
        <div className="px-5 py-8 md:px-8 md:py-12">
          <div className="flex items-center justify-center gap-4 md:gap-10">
            {/* Home team */}
            <div className="flex flex-1 flex-col items-center gap-3">
              <span
                className="flex h-16 w-16 items-center justify-center rounded-full bg-[#111111] font-display text-xl text-white md:h-20 md:w-20 md:text-2xl"
                style={{ fontWeight: 900 }}
              >
                {match.home_team.charAt(0)}
              </span>
              <h2
                className="text-center font-display text-base tracking-tight md:text-xl"
                style={{ fontWeight: 900 }}
              >
                {match.home_team}
              </h2>
            </div>

            {/* Score / VS */}
            <div className="shrink-0 text-center">
              {showScore ? (
                <div className="flex items-baseline gap-2 md:gap-4">
                  <span
                    className="font-display text-5xl tabular-nums md:text-7xl"
                    style={{ fontWeight: 900 }}
                  >
                    {match.home_score ?? 0}
                  </span>
                  <span
                    className="font-display text-2xl text-[#E5E5E5] md:text-4xl"
                    style={{ fontWeight: 900 }}
                  >
                    -
                  </span>
                  <span
                    className="font-display text-5xl tabular-nums md:text-7xl"
                    style={{ fontWeight: 900 }}
                  >
                    {match.away_score ?? 0}
                  </span>
                </div>
              ) : (
                <span
                  className="font-display text-3xl text-[#707072] md:text-5xl"
                  style={{ fontWeight: 900 }}
                >
                  VS
                </span>
              )}
            </div>

            {/* Away team */}
            <div className="flex flex-1 flex-col items-center gap-3">
              <span
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#E5E5E5] bg-white font-display text-xl text-[#111111] md:h-20 md:w-20 md:text-2xl"
                style={{ fontWeight: 900 }}
              >
                {match.away_team.charAt(0)}
              </span>
              <h2
                className="text-center font-display text-base tracking-tight md:text-xl"
                style={{ fontWeight: 900 }}
              >
                {match.away_team}
              </h2>
            </div>
          </div>

          {match.precautions && (
            <p className="mt-6 text-center font-body text-sm text-[#707072]">
              {match.precautions}
            </p>
          )}
        </div>
      </div>

      {/* Match timeline */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <h3
            className="font-display text-lg uppercase tracking-wide md:text-xl"
            style={{ fontWeight: 700 }}
          >
            比赛动态
          </h3>
          {isLive && (
            <PulsingDot color="bg-[#FA5400]" className="h-2.5 w-2.5" />
          )}
        </div>
        <MatchTimeline matchId={matchId} isLive={isLive} />
      </section>

      {/* Media gallery */}
      {match.media && match.media.length > 0 && (
        <section>
          <h3
            className="mb-4 font-display text-lg uppercase tracking-wide md:text-xl"
            style={{ fontWeight: 700 }}
          >
            比赛媒体
          </h3>
          <MediaGallery media={match.media} />
        </section>
      )}
    </div>
  )
}
