import { useQuery } from "@tanstack/react-query"
import { PublicService } from "@/client"

interface MatchTimelineProps {
  matchId: string
  isLive?: boolean
}

export function MatchTimeline({ matchId, isLive = false }: MatchTimelineProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["match-updates", matchId],
    queryFn: () => PublicService.getMatchUpdates({ matchId }),
    refetchInterval: isLive ? 5000 : false,
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="h-3 w-3 shrink-0 animate-pulse rounded-full bg-border" />
            <div className="h-12 w-full animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  const updates = data?.data ?? []

  if (updates.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center">
        <p className="font-body text-sm text-muted-foreground">
          {isLive ? "等待比赛动态..." : "暂无比赛动态"}
        </p>
      </div>
    )
  }

  return (
    <div className="relative space-y-0">
      <div className="absolute bottom-2 left-[5px] top-2 w-px bg-border" />

      {updates.map((update, idx) => (
        <div key={update.id} className="relative flex gap-4 pb-5">
          <div
            className={`relative z-10 mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border-2 transition-colors ${
              idx === 0 && isLive
                ? "border-secondary bg-secondary"
                : "border-border bg-background"
            }`}
          />
          <div className="min-w-0 flex-1">
            <p className="font-body text-sm leading-relaxed text-foreground">
              {update.content}
            </p>
            <time className="mt-1 block font-body text-xs text-muted-foreground">
              {new Date(update.created_at).toLocaleTimeString("zh-CN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
        </div>
      ))}
    </div>
  )
}
