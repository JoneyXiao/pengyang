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

function MatchesPage() {
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming")

  const { data, isLoading } = useQuery({
    queryKey: ["public-matches", tab],
    queryFn: () => PublicService.getMatches({ status: tab }),
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <h1
        className="mb-8 text-3xl uppercase tracking-[-0.02em] md:text-4xl"
        style={{ fontFamily: "Jost, sans-serif", fontWeight: 900 }}
      >
        比赛日程
      </h1>

      {/* Tabs */}
      <div className="mb-8 flex gap-2">
        {[
          { value: "upcoming" as const, label: "即将开始" },
          { value: "completed" as const, label: "已结束" },
        ].map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={`rounded-full px-5 py-2 text-sm font-medium uppercase transition ${
              tab === t.value
                ? "bg-[#111111] text-white"
                : "bg-[#F5F5F5] text-[#707072] hover:bg-[#E5E5E5]"
            }`}
            style={{
              fontFamily: "Jost, sans-serif",
              fontWeight: 700,
              borderRadius: 30,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-lg bg-[#F5F5F5]"
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
        <div className="py-16 text-center">
          <p
            className="text-lg text-[#707072]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {tab === "upcoming" ? "暂无即将开始的比赛" : "暂无已结束的比赛"}
          </p>
        </div>
      )}
    </div>
  )
}
