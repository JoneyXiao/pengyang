import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { PublicService } from "@/client"

export const Route = createFileRoute("/_public/team")({
  component: TeamPage,
  head: () => ({
    meta: [{ title: "球队介绍 - 鹏飏足球" }],
  }),
})

const PHILOSOPHY_VALUES = [
  {
    title: "拼搏进取",
    description:
      "我们主导比赛节奏。高位逼抢、快速转换和扎实的体能储备，是我们战术体系的基石。",
  },
  {
    title: "严守纪律",
    description:
      "天赋离不开体系的支撑。训练场上的高度专注，转化为比赛中精准的执行力。",
  },
  {
    title: "团结一心",
    description:
      "球队荣誉高于个人荣耀。我们并肩作战、共同成长，打造一支有凝聚力的队伍。",
  },
]

function TeamPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-team-content"],
    queryFn: () => PublicService.getTeamContent(),
  })

  return (
    <div>
      {/* Full-height hero */}
      <section className="relative flex min-h-[60vh] items-end overflow-hidden bg-[#111111] md:min-h-[716px]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-[#111111]/85 to-[#1a1a1a]" />
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#FA5400]/6 to-transparent" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-24 md:px-8 md:pb-20 md:pt-32">
          <h1
            className="max-w-3xl font-display text-5xl leading-[0.9] tracking-[-0.02em] text-white md:text-7xl lg:text-[110px]"
            style={{ fontWeight: 900 }}
          >
            无惧风雨
            <br />
            <span className="text-[#FA5400]">逐梦绿茵</span>
          </h1>
        </div>
      </section>

      {/* Admin-editable content */}
      <section className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-20">
        {isError ? (
          <div className="py-16 text-center">
            <p className="font-body text-[#707072]">加载失败，请刷新页面重试</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-5 animate-pulse rounded bg-[#F5F5F5]"
                style={{ width: `${90 - i * 15}%` }}
              />
            ))}
          </div>
        ) : data?.content ? (
          <div
            className="team-prose prose prose-lg max-w-none prose-headings:font-display prose-headings:tracking-tight prose-headings:text-[#111111] prose-p:font-body prose-p:leading-relaxed prose-p:text-[#111111]/80 prose-a:text-[#FA5400] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#111111] prose-img:rounded-lg"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: content is sanitized server-side via nh3
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        ) : (
          <div className="py-16 text-center">
            <p className="font-body text-[#707072]">暂无球队介绍内容</p>
          </div>
        )}
      </section>

      {/* Philosophy band */}
      <section className="bg-[#111111] px-4 py-16 text-white md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 font-body text-xs uppercase tracking-[0.15em] text-white/40">
            球队理念
          </p>
          <h2
            className="mb-12 font-display text-4xl leading-[0.9] tracking-tight md:mb-16 md:text-6xl lg:text-[80px]"
            style={{ fontWeight: 900 }}
          >
            追求卓越
            <br />
            超越自我
          </h2>
          <div className="grid gap-8 border-t border-white/10 pt-8 md:grid-cols-3 md:gap-12">
            {PHILOSOPHY_VALUES.map((v) => (
              <div key={v.title}>
                <h3
                  className="mb-3 font-display text-lg italic tracking-tight md:text-xl"
                  style={{ fontWeight: 700 }}
                >
                  {v.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-white/60">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trophy cabinet — hidden until real achievement data is available */}
    </div>
  )
}
