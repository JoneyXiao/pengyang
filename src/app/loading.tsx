export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="h-[480px] rounded-b-[20px] bg-muted md:h-[560px] lg:h-[640px]" />

      {/* Upcoming matches skeleton */}
      <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="h-8 w-32 rounded bg-muted" />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-muted" />
          ))}
        </div>
      </div>

      {/* Results skeleton */}
      <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="h-8 w-32 rounded bg-muted" />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-muted" />
          ))}
        </div>
      </div>

      {/* Team intro skeleton */}
      <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="h-8 w-24 rounded bg-muted" />
            <div className="h-20 rounded bg-muted" />
          </div>
          <div className="aspect-[4/3] rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  )
}
