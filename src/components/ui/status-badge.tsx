import type { MatchStatus } from '@/lib/types'
import { STATUS_LABELS } from '@/lib/constants/locale'
import { cn } from '@/lib/utils'

const variants: Record<MatchStatus, string> = {
  upcoming: 'bg-sky-100 text-sky-600',
  live: 'bg-red-100 text-red-600',
  completed: 'bg-green-100 text-green-600',
  cancelled: 'bg-zinc-100 text-zinc-500',
}

interface StatusBadgeProps {
  status: MatchStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium',
        variants[status]
      )}
    >
      {status === 'live' && (
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-red-600" />
        </span>
      )}
      {STATUS_LABELS[status]}
    </span>
  )
}
