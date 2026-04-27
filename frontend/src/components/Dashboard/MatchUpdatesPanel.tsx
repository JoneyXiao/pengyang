import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { MatchUpdatesService } from "@/client"
import useCustomToast from "@/hooks/useCustomToast"

export function MatchUpdatesPanel({ matchId }: { matchId: string }) {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const [content, setContent] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["match-updates", matchId],
    queryFn: () => MatchUpdatesService.getMatchUpdates({ matchId }),
  })

  const createMutation = useMutation({
    mutationFn: () =>
      MatchUpdatesService.createMatchUpdate({
        matchId,
        requestBody: { content },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match-updates", matchId] })
      setContent("")
      showSuccessToast("动态已发布")
    },
    onError: () => showErrorToast("发布失败"),
  })

  const deleteMutation = useMutation({
    mutationFn: (updateId: string) =>
      MatchUpdatesService.deleteMatchUpdate({ matchId, updateId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match-updates", matchId] })
      showSuccessToast("动态已删除")
    },
    onError: () => showErrorToast("删除失败"),
  })

  return (
    <div>
      <h3
        className="mb-3 font-display text-sm tracking-wide"
        style={{ fontWeight: 700 }}
      >
        比赛动态
      </h3>
      <div className="mb-3 flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="输入比赛动态..."
          className="flex-1 rounded-lg border-1 border-input bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus:border-ring focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
        />
        <button
          type="button"
          disabled={!content.trim()}
          onClick={() => createMutation.mutate()}
          className="shrink-0 rounded-[30px] bg-primary px-4 py-2 font-display text-xs tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          style={{ fontWeight: 700 }}
        >
          发布
        </button>
      </div>
      {isLoading ? (
        <div className="h-8 animate-pulse rounded bg-muted" />
      ) : data?.data && data.data.length > 0 ? (
        <div className="space-y-2">
          {data.data.map((update) => (
            <div
              key={update.id}
              className="flex items-start justify-between rounded-lg bg-muted px-3 py-2.5 text-sm"
            >
              <div>
                <p className="text-foreground">{update.content}</p>
                <time className="text-xs text-muted-foreground">
                  {new Date(update.created_at).toLocaleTimeString("zh-CN", {
                    timeZone: "Asia/Shanghai",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              <button
                type="button"
                className="ml-2 rounded text-xs text-destructive hover:underline outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                onClick={() => deleteMutation.mutate(update.id)}
              >
                删除
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">暂无动态</p>
      )}
    </div>
  )
}
