import { Link } from "@tanstack/react-router"
import { PulsingDot } from "./PulsingDot"

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-[#111111] text-white md:min-h-[80vh]">
      {/* Background gradient (placeholder for future hero image) */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-[#111111]/90 to-[#292929]" />
        <div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-[#FA5400]/8 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#111111] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-end px-4 pb-16 pt-20 md:px-8 md:pb-24 md:pt-32">
        {/* Season badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#FA5400]/15 px-4 py-1.5 text-sm font-medium text-[#FA5400] backdrop-blur-sm">
            <PulsingDot color="bg-[#FA5400]" className="h-2 w-2" />
            赛季进行中
          </span>
        </div>

        {/* Headline */}
        <h1
          className="mb-6 max-w-4xl font-display text-5xl leading-[0.95] tracking-[-0.02em] md:text-7xl lg:text-[96px]"
          style={{ fontWeight: 900 }}
        >
          无惧挑战
          <br />
          <span className="text-[#FA5400]">铸就辉煌</span>
        </h1>

        {/* Subtitle */}
        <p className="mb-8 max-w-lg font-body text-base leading-relaxed text-white/60 md:text-lg">
          深圳市龙华区观湖实验学校 - 鹏飏。汇聚最新赛事、球队动态与核心阵容信息。以拼搏之姿，捍卫主场荣誉。
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/matches"
            className="flex h-12 items-center justify-center rounded-[30px] bg-white px-8 font-body text-sm font-medium text-[#111111] transition-colors hover:bg-white/90"
          >
            查看最新赛程
          </Link>
          <Link
            to="/team"
            className="flex h-12 items-center justify-center rounded-[30px] border border-white/30 px-8 font-body text-sm font-medium text-white transition-colors hover:border-white/60 hover:bg-white/5"
          >
            了解球队
          </Link>
        </div>
      </div>
    </section>
  )
}
