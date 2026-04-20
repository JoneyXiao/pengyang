import type { Match } from '@/lib/types'
import { MatchCard } from '@/components/ui/match-card'
import { EmptyState } from '@/components/landing/empty-state'
import { EMPTY_STATES } from '@/lib/constants/locale'

interface ResultsSectionProps {
  matches: Match[]
  title: string
}

export function ResultsSection({ matches, title }: ResultsSectionProps) {
  if (matches.length === 0) {
    return (
      <section className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <h2 className="text-[28px] font-bold leading-[1.25] tracking-tight">
          {title}
        </h2>
        <div className="mt-8">
          <EmptyState message={EMPTY_STATES.noResults} />
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <h2 className="text-[28px] font-bold leading-[1.25] tracking-tight">
        {title}
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  )
}
