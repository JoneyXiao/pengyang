import Link from 'next/link'
import type { Match } from '@/lib/types'
import { MatchCard } from '@/components/ui/match-card'
import { EmptyState } from '@/components/landing/empty-state'
import { SECTIONS, EMPTY_STATES } from '@/lib/constants/locale'

interface MatchesSectionProps {
  matches: Match[]
  title: string
}

export function MatchesSection({ matches, title }: MatchesSectionProps) {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-[28px] font-bold leading-[1.25] tracking-tight">
          {title}
        </h2>
        <Link
          href="/schedule"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {SECTIONS.viewSchedule} →
        </Link>
      </div>

      {matches.length === 0 ? (
        <div className="mt-8">
          <EmptyState message={EMPTY_STATES.noUpcoming} />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </section>
  )
}
