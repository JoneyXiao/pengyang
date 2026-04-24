import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { PublicService } from "@/client"
import { MatchCard } from "@/components/Public/MatchCard"

export const Route = createFileRoute("/_public/matches/")({
  component: MatchesPage,
  head: () => ({
    meta: [{ title: "比赛日程 - 鹏飏足球" }],
  }),
})

const tabs = [
  { value: "upcoming" as const, label: "即将开始" },
  { value: "live" as const, label: "进行中" },
  { value: "completed" as const, label: "已结束" },
]

function MatchesPage() {
  const [tab, setTab] = useState<"upcoming" | "live" | "completed">("upcoming")

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-matches", tab],
    queryFn: () => PublicService.getMatches({ status: tab }),
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <h1
        className="mb-2 font-display text-3xl tracking-tight md:text-4xl lg:text-5xl"
        style={{ fontWeight: 900 }}
      >
        比赛日程
      </h1>
      <p className="mb-8 font-body text-sm text-[#707072]">MATCH SCHEDULE</p>

      {/* Tabs */}
      <div className="mb-8 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={`rounded-[30px] px-5 py-2.5 font-display text-sm tracking-wide transition-colors ${
              tab === t.value
                ? "bg-[#111111] text-white"
                : "bg-[#F5F5F5] text-[#707072] hover:bg-[#E5E5E5]"
            }`}
            style={{ fontWeight: 700 }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isError ? (
        <div className="py-20 text-center">
          <p className="font-body text-lg text-[#707072]">
            加载失败，请刷新页面重试
          </p>
        </div>
      ) : isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-lg bg-[#F5F5F5]"
            />
          ))}
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.data.map((match) => (
            <MatchCard
              key={match.id}
              id={match.id}
              matchDate={match.match_date}
              homeTeam={match.home_team}
              awayTeam={match.away_team}
              homeScore={match.home_score}
              awayScore={match.away_score}
              status={match.status}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="font-body text-lg text-[#707072]">
            {tab === "upcoming"
              ? "暂无即将开始的比赛"
              : tab === "live"
                ? "暂无进行中的比赛"
                : "暂无已结束的比赛"}
          </p>
        </div>
      )}
    </div>
  )
}
