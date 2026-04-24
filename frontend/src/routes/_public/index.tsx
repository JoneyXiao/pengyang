import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Clock } from "lucide-react"
import type { MatchPublic } from "@/client"
import { PublicService } from "@/client"
import { CountdownTimer } from "@/components/Public/CountdownTimer"
import { HeroSection } from "@/components/Public/HeroSection"
import { MatchCard } from "@/components/Public/MatchCard"

export const Route = createFileRoute("/_public/")({
  component: LandingPage,
  head: () => ({
    meta: [{ title: "深圳市龙华区观湖实验学校 - 鹏飏" }],
  }),
})

function LandingPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["landing"],
    queryFn: () => PublicService.getLandingPage(),
  })

  const nextMatch = data?.upcoming_matches?.[0]

  if (isError) {
    return (
      <div>
        <HeroSection />
        <div className="py-20 text-center">
          <p className="font-body text-lg text-[#707072]">
            加载失败，请刷新页面重试
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <HeroSection />

      {/* Next Match Bento */}
      {(isLoading || nextMatch) && (
        <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <div className="mb-6 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <h2
                className="font-display text-xl tracking-tight md:text-2xl"
                style={{ fontWeight: 900 }}
              >
                下一场比赛
              </h2>
              <span className="hidden font-display text-sm tracking-wide text-[#707072] md:inline">
                NEXT MATCH
              </span>
            </div>
            {nextMatch && (
              <span className="font-body text-xs text-[#707072] md:text-sm">
                {new Date(nextMatch.match_date).toLocaleDateString("zh-CN", {
                  month: "long",
                  day: "numeric",
                  weekday: "short",
                })}
                {" · "}
                {new Date(nextMatch.match_date).toLocaleTimeString("zh-CN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-5">
              <div className="h-48 animate-pulse rounded-lg bg-[#F5F5F5] md:col-span-3" />
              <div className="h-48 animate-pulse rounded-lg bg-[#F5F5F5] md:col-span-2" />
            </div>
          ) : nextMatch ? (
            <div className="grid gap-4 md:grid-cols-5">
              {/* Match info card */}
              <Link
                to="/matches/$matchId"
                params={{ matchId: nextMatch.id }}
                className="group flex flex-col items-center justify-center rounded-lg border border-[#E5E5E5] p-6 transition-transform hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] md:col-span-3 md:p-8"
              >
                <span className="mb-4 font-body text-xs uppercase tracking-[0.15em] text-[#707072]">
                  {nextMatch.home_team === data?.team_name ? "主场" : "客场"}
                </span>
                <div className="flex w-full items-center justify-center gap-6 md:gap-10">
                  <div className="flex flex-col items-center gap-2">
                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-[#111111] font-display text-lg text-white md:h-16 md:w-16 md:text-xl"
                      style={{ fontWeight: 900 }}
                    >
                      {nextMatch.home_team.charAt(0)}
                    </span>
                    <span
                      className="max-w-[100px] truncate font-display text-sm tracking-tight md:text-base"
                      style={{ fontWeight: 700 }}
                    >
                      {nextMatch.home_team}
                    </span>
                  </div>
                  <span
                    className="font-display text-2xl text-[#707072] md:text-3xl"
                    style={{ fontWeight: 900 }}
                  >
                    VS
                  </span>
                  <div className="flex flex-col items-center gap-2">
                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#E5E5E5] bg-white font-display text-lg text-[#111111] md:h-16 md:w-16 md:text-xl"
                      style={{ fontWeight: 900 }}
                    >
                      {nextMatch.away_team.charAt(0)}
                    </span>
                    <span
                      className="max-w-[100px] truncate font-display text-sm tracking-tight md:text-base"
                      style={{ fontWeight: 700 }}
                    >
                      {nextMatch.away_team}
                    </span>
                  </div>
                </div>
                {nextMatch.precautions && (
                  <p className="mt-4 font-body text-xs text-[#707072]">
                    {nextMatch.precautions}
                  </p>
                )}
              </Link>

              {/* Countdown card */}
              <div className="flex flex-col items-center justify-center rounded-lg bg-[#111111] p-6 text-white md:col-span-2 md:p-8">
                <div className="mb-4 flex items-center gap-2">
                  <Clock size={14} className="text-[#FA5400]" />
                  <span className="font-body text-xs uppercase tracking-[0.15em] text-white/50">
                    距离开赛还有
                  </span>
                </div>
                <CountdownTimer targetDate={nextMatch.match_date} />
              </div>
            </div>
          ) : null}
        </section>
      )}

      {/* Highlights Bento */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <div className="mb-6 flex items-center justify-between border-b-2 border-[#111111] pb-3">
          <h2
            className="font-display text-xl tracking-tight md:text-2xl"
            style={{ fontWeight: 900 }}
          >
            赛场高光
          </h2>
          <Link
            to="/matches"
            className="font-body text-sm text-[#707072] transition-colors hover:text-[#111111]"
          >
            全部战报 →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-[4px] md:grid-cols-2 md:grid-rows-2 md:h-[600px]">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse bg-[#F5F5F5] md:h-auto"
              />
            ))}
          </div>
        ) : data?.recent_matches && data.recent_matches.length > 0 ? (
          <HighlightsBento matches={data.recent_matches} />
        ) : (
          <div className="py-16 text-center">
            <p className="font-body text-[#707072]">暂无比赛记录</p>
          </div>
        )}

        {/* Upcoming matches */}
        {data?.upcoming_matches && data.upcoming_matches.length > 1 && (
          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2
                className="font-display text-xl tracking-tight md:text-2xl"
                style={{ fontWeight: 900 }}
              >
                即将开始
              </h2>
              <Link
                to="/matches"
                className="font-body text-sm text-[#707072] transition-colors hover:text-[#111111]"
              >
                查看全部 →
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {data.upcoming_matches.slice(1).map((m) => (
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
          </div>
        )}
      </section>
    </div>
  )
}

function HighlightsBento({ matches }: { matches: MatchPublic[] }) {
  const m0 = matches[0]
  const m1 = matches[1]
  const m2 = matches[2]

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("zh-CN", {
      month: "long",
      day: "numeric",
    })

  const scoreLine = (m: MatchPublic) =>
    `${m.home_score ?? 0} - ${m.away_score ?? 0}`

  const matchTitle = (m: MatchPublic) =>
    m.status === "completed"
      ? `${scoreLine(m)} ${m.home_team} vs ${m.away_team}`
      : `${m.home_team} vs ${m.away_team}`

  if (matches.length < 2) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((m) => (
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
    )
  }

  return (
    <div className="grid gap-[4px] md:grid-cols-2 md:grid-rows-2 md:h-[600px]">
      {/* Primary card - spans 2 rows on desktop */}
      <Link
        to="/matches/$matchId"
        params={{ matchId: m0.id }}
        className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden bg-[#111111] p-5 md:row-span-2 md:p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-[#111111]/80 to-[#292929]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10">
          <span className="mb-3 inline-block rounded-sm bg-[#FA5400] px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
            高光时刻
          </span>
          <h3
            className="mb-2 max-w-md font-display text-2xl leading-tight tracking-tight text-white md:text-3xl lg:text-4xl"
            style={{ fontWeight: 900 }}
          >
            {matchTitle(m0)}
          </h3>
          <p className="max-w-sm font-body text-sm leading-relaxed text-white/60">
            {m0.status === "completed"
              ? `${formatDate(m0.match_date)} · ${m0.home_team} 对阵 ${m0.away_team}，最终比分 ${scoreLine(m0)}`
              : `${formatDate(m0.match_date)} · 即将对阵 ${m0.away_team}`}
          </p>
        </div>
        <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      {/* Secondary card - top right */}
      <Link
        to="/matches/$matchId"
        params={{ matchId: m1.id }}
        className="group relative flex min-h-[140px] flex-col justify-end overflow-hidden bg-[#1a1a1a] p-5 md:p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#222222]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative z-10">
          <p className="mb-1 font-body text-[10px] uppercase tracking-[0.1em] text-white/40">
            {formatDate(m1.match_date)}
          </p>
          <h4
            className="font-display text-base tracking-tight text-white md:text-lg"
            style={{ fontWeight: 700 }}
          >
            {matchTitle(m1)}
          </h4>
        </div>
        <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      {/* Bottom row: team CTA + third match */}
      <div className="grid gap-[4px] md:grid-cols-2">
        {/* Team intro CTA */}
        <Link
          to="/roster"
          className="group flex min-h-[140px] flex-col justify-between bg-[#FA5400] p-5 text-white md:p-6"
        >
          <div>
            <svg
              className="mb-3 h-8 w-8 text-white/80"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M12 2 a10 10 0 0 1 5.5 3.5 L14 9 h-4 L6.5 5.5 A10 10 0 0 1 12 2z" />
              <path d="M2.1 10.5 L8 10 l2.5 3.5 -1.5 4.5 -5-2 A10 10 0 0 1 2.1 10.5z" />
              <path d="M21.9 10.5 L16 10 l-2.5 3.5 1.5 4.5 5-2 A10 10 0 0 0 21.9 10.5z" />
            </svg>
            <h4
              className="mb-1 font-display text-lg tracking-tight md:text-xl"
              style={{ fontWeight: 900 }}
            >
              了解我们的阵容
            </h4>
            <p className="font-body text-sm text-white/80">
              查看教练组与全体球员介绍
            </p>
          </div>
          <span className="mt-3 inline-flex items-center font-body text-sm font-medium text-white transition-transform group-hover:translate-x-1">
            查看阵容 →
          </span>
        </Link>

        {/* Third match card */}
        {m2 ? (
          <Link
            to="/matches/$matchId"
            params={{ matchId: m2.id }}
            className="group relative flex min-h-[140px] flex-col justify-end overflow-hidden bg-[#111111] p-5 md:p-6"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#111111] to-[#222222]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="relative z-10">
              <p className="mb-1 font-body text-[10px] uppercase tracking-[0.1em] text-white/40">
                {formatDate(m2.match_date)}
              </p>
              <h4
                className="font-display text-base tracking-tight text-white md:text-lg"
                style={{ fontWeight: 700 }}
              >
                {matchTitle(m2)}
              </h4>
            </div>
            <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
        ) : (
          <div className="flex min-h-[140px] items-center justify-center bg-[#111111] p-5">
            <p className="font-body text-sm text-white/30">更多内容即将呈现</p>
          </div>
        )}
      </div>
    </div>
  )
}
