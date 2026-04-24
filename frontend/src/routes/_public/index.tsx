import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { PublicService } from "@/client"
import { HeroSection } from "@/components/Public/HeroSection"
import { MatchCard } from "@/components/Public/MatchCard"

export const Route = createFileRoute("/_public/")({
  component: LandingPage,
  head: () => ({
    meta: [{ title: "鹏飏足球 - 深圳市龙华区观湖实验学校足球队" }],
  }),
})

function LandingPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["landing"],
    queryFn: () => PublicService.getLandingPage(),
  })

  return (
    <div>
      <HeroSection />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        {/* Upcoming Matches */}
        <div className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2
              className="text-2xl uppercase tracking-[-0.02em]"
              style={{ fontFamily: "Jost, sans-serif", fontWeight: 900 }}
            >
              即将开始
            </h2>
            <Link
              to="/matches"
              className="text-sm text-[#707072] transition-colors hover:text-[#111111]"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              查看全部 →
            </Link>
          </div>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-lg bg-[#F5F5F5]"
                />
              ))}
            </div>
          ) : data?.upcoming_matches && data.upcoming_matches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {data.upcoming_matches.map((m) => (
                <MatchCard
                  key={m.id}
                  id={m.id}
                  matchDate={m.match_date}
                  homeTeam={m.home_team}
                  awayTeam={m.away_team}
                  status={m.status}
                  homeScore={m.home_score}
                  awayScore={m.away_score}
                />
              ))}
            </div>
          ) : (
            <p
              className="text-[#707072]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              暂无即将开始的比赛
            </p>
          )}
        </div>

        {/* Recent Matches */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2
              className="text-2xl uppercase tracking-[-0.02em]"
              style={{ fontFamily: "Jost, sans-serif", fontWeight: 900 }}
            >
              最近比赛
            </h2>
            <Link
              to="/matches"
              className="text-sm text-[#707072] transition-colors hover:text-[#111111]"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              查看全部 →
            </Link>
          </div>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-lg bg-[#F5F5F5]"
                />
              ))}
            </div>
          ) : data?.recent_matches && data.recent_matches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {data.recent_matches.map((m) => (
                <MatchCard
                  key={m.id}
                  id={m.id}
                  matchDate={m.match_date}
                  homeTeam={m.home_team}
                  awayTeam={m.away_team}
                  status={m.status}
                  homeScore={m.home_score}
                  awayScore={m.away_score}
                />
              ))}
            </div>
          ) : (
            <p
              className="text-[#707072]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              暂无比赛记录
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
