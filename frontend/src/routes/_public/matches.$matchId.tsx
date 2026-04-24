import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { PublicService } from "@/client"
import { MatchTimeline } from "@/components/Public/MatchTimeline"
import { MediaGallery } from "@/components/Public/MediaGallery"

export const Route = createFileRoute("/_public/matches/$matchId")({
  component: MatchDetailPage,
  head: () => ({
    meta: [{ title: "比赛详情 - 鹏飏足球" }],
  }),
})

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  upcoming: { text: "即将开始", color: "bg-[#111111] text-white" },
  live: { text: "进行中", color: "bg-[#FA5400] text-white" },
  completed: { text: "已结束", color: "bg-[#F5F5F5] text-[#707072]" },
}

function MatchDetailPage() {
  const { matchId } = Route.useParams()

  const { data: match, isLoading } = useQuery({
    queryKey: ["public-match-detail", matchId],
    queryFn: () => PublicService.getMatchDetail({ matchId }),
  })

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <div className="space-y-6">
          <div className="h-32 animate-pulse rounded-lg bg-[#F5F5F5]" />
          <div className="h-48 animate-pulse rounded-lg bg-[#F5F5F5]" />
        </div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center md:px-8">
        <p className="text-lg text-[#707072]">比赛不存在</p>
      </div>
    )
  }

  const badge = STATUS_LABELS[match.status] ?? STATUS_LABELS.upcoming
  const date = new Date(match.match_date)
  const isLive = match.status === "live"

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      {/* Match header */}
      <div className="mb-8 rounded-lg border border-[#E5E5E5] p-6 md:p-8">
        <div className="mb-4 flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.color}`}
          >
            {badge.text}
          </span>
          <span
            className="text-sm text-[#707072]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
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

        <div className="flex items-center justify-center gap-6 md:gap-12">
          <div className="flex-1 text-right">
            <h2
              className="text-xl md:text-3xl"
              style={{ fontFamily: "Jost, sans-serif", fontWeight: 900 }}
            >
              {match.home_team}
            </h2>
          </div>

          <div className="text-center">
            {match.status === "completed" || match.status === "live" ? (
              <span
                className="text-3xl tabular-nums md:text-5xl"
                style={{ fontFamily: "Jost, sans-serif", fontWeight: 900 }}
              >
                {match.home_score ?? 0} - {match.away_score ?? 0}
              </span>
            ) : (
              <span
                className="text-2xl text-[#707072] md:text-4xl"
                style={{ fontFamily: "Jost, sans-serif", fontWeight: 900 }}
              >
                VS
              </span>
            )}
          </div>

          <div className="flex-1 text-left">
            <h2
              className="text-xl md:text-3xl"
              style={{ fontFamily: "Jost, sans-serif", fontWeight: 900 }}
            >
              {match.away_team}
            </h2>
          </div>
        </div>

        {match.precautions && (
          <p
            className="mt-4 text-center text-sm text-[#707072]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {match.precautions}
          </p>
        )}
      </div>

      {/* Match timeline */}
      <section className="mb-8">
        <h3
          className="mb-4 text-xl uppercase"
          style={{ fontFamily: "Jost, sans-serif", fontWeight: 700 }}
        >
          比赛动态
          {isLive && (
            <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-[#FA5400]" />
          )}
        </h3>
        <MatchTimeline matchId={matchId} isLive={isLive} />
      </section>

      {/* Media gallery */}
      {match.media && match.media.length > 0 && (
        <section>
          <h3
            className="mb-4 text-xl uppercase"
            style={{ fontFamily: "Jost, sans-serif", fontWeight: 700 }}
          >
            比赛媒体
          </h3>
          <MediaGallery media={match.media} />
        </section>
      )}
    </div>
  )
}
