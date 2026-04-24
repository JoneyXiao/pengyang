export function HeroSection() {
  return (
    <section className="relative bg-[#111111] text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-32">
        <div className="relative z-10">
          <p
            className="mb-4 text-sm uppercase tracking-[0.15em] text-[#FA5400]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
          >
            深圳市龙华区
          </p>
          <h1
            className="mb-6 text-5xl leading-[0.95] tracking-[-0.02em] uppercase md:text-7xl lg:text-[96px]"
            style={{ fontFamily: "Jost, sans-serif", fontWeight: 900 }}
          >
            观湖实验学校
            <br />
            <span className="text-[#FA5400]">足球队</span>
          </h1>
          <p
            className="max-w-md text-base text-white/70"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
          >
            拼搏进取，团结协作。用汗水和热爱书写属于我们的足球故事。
          </p>
        </div>
      </div>
      {/* Decorative diagonal */}
      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#FA5400]/10 to-transparent" />
    </section>
  )
}
