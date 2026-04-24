import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { MatchUpdatesService, PublicService } from "@/client"
import useCustomToast from "@/hooks/useCustomToast"

export function MatchUpdatesPanel({ matchId }: { matchId: string }) {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const [content, setContent] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["match-updates", matchId],
    queryFn: () => PublicService.getMatchUpdates({ matchId }),
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
          className="flex-1 rounded-lg border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm transition-colors focus:border-[#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-1"
        />
        <button
          type="button"
          disabled={!content.trim()}
          onClick={() => createMutation.mutate()}
          className="shrink-0 rounded-[30px] bg-[#111111] px-4 py-2 font-display text-xs tracking-wide text-white transition-colors hover:bg-[#292929] disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
          style={{ fontWeight: 700 }}
        >
          发布
        </button>
      </div>
      {isLoading ? (
        <div className="h-8 animate-pulse rounded bg-[#F5F5F5]" />
      ) : data?.data && data.data.length > 0 ? (
        <div className="space-y-2">
          {data.data.map((update) => (
            <div
              key={update.id}
              className="flex items-start justify-between rounded-lg bg-[#F5F5F5] px-3 py-2.5 text-sm"
            >
              <div>
                <p className="text-[#111111]">{update.content}</p>
                <time className="text-xs text-[#707072]">
                  {new Date(update.created_at).toLocaleTimeString("zh-CN", {
                    timeZone: "Asia/Shanghai",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              <button
                type="button"
                className="ml-2 text-xs text-red-500 hover:underline outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 rounded"
                onClick={() => deleteMutation.mutate(update.id)}
              >
                删除
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[#B0B0B0]">暂无动态</p>
      )}
    </div>
  )
}
