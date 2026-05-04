import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import { IoCalendarOutline } from "react-icons/io5"
import type { MatchCreate, MatchPatch, MatchStatus } from "@/client"
import { MatchesService } from "@/client"
import { EditMatchInline } from "@/components/Dashboard/EditMatchInline"
import { LiveScoreWidget } from "@/components/Dashboard/LiveScoreWidget"
import { MatchUpdatesPanel } from "@/components/Dashboard/MatchUpdatesPanel"
import { MediaUploadCard } from "@/components/Dashboard/MediaUploadCard"
import {
  BEIJING_TZ_OFFSET,
  STATUS_COLORS,
  STATUS_LABELS,
} from "@/components/Dashboard/shared"
import { PulsingDot } from "@/components/Public/PulsingDot"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import useCustomToast from "@/hooks/useCustomToast"

export const Route = createFileRoute("/_layout/dashboard")({
  component: MatchesManagement,
  head: () => ({ meta: [{ title: "比赛管理 - 鹏飏" }] }),
})

function MatchesManagement() {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<MatchStatus | "">("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const addMatchFormRef = useRef<HTMLDivElement>(null)
  const createFormRef = useRef<HTMLFormElement>(null)

  const handleSetEditingId = useCallback((id: string | null) => {
    setEditingId(id)
    if (id) setExpandedId(null)
  }, [])

  const handleSetExpandedId = useCallback((id: string | null) => {
    setExpandedId(id)
    if (id) setEditingId(null)
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: ["admin-matches", statusFilter],
    queryFn: () =>
      MatchesService.listMatches({
        status: statusFilter || undefined,
      }),
  })

  const createMutation = useMutation({
    mutationFn: (body: MatchCreate) =>
      MatchesService.createMatch({ requestBody: body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-matches"] })
      createFormRef.current?.reset()
      showSuccessToast("比赛已创建")
    },
    onError: () => showErrorToast("创建失败"),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: MatchPatch }) =>
      MatchesService.updateMatch({ matchId: id, requestBody: body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-matches"] })
      showSuccessToast("比赛已更新")
      setEditingId(null)
    },
    onError: () => showErrorToast("更新失败"),
  })

  const deleteMutation = useMutation({
    mutationFn: (matchId: string) => MatchesService.deleteMatch({ matchId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-matches"] })
      showSuccessToast("比赛已删除")
    },
    onError: () => showErrorToast("删除失败"),
  })

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (createMutation.isPending) return
    const fd = new FormData(e.currentTarget)
    const body: MatchCreate = {
      match_date: `${fd.get("match_date") as string}${BEIJING_TZ_OFFSET}`,
      home_team: fd.get("home_team") as string,
      away_team: fd.get("away_team") as string,
      precautions: (fd.get("precautions") as string) || undefined,
      is_public: fd.get("is_public") === "on",
    }
    createMutation.mutate(body)
  }

  const toggleStatus = (matchId: string, currentStatus: string) => {
    const next: Record<string, MatchStatus> = {
      upcoming: "live",
      live: "completed",
      completed: "upcoming",
    }
    updateMutation.mutate({
      id: matchId,
      body: { status: next[currentStatus] },
    })
  }

  const liveMatch = data?.data?.find((m) => m.status === "live")

  return (
    <div>
      {/* Dashboard header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1
            className="font-display text-3xl tracking-tight md:text-4xl"
            style={{ fontWeight: 900 }}
          >
            管理面板
          </h1>
          <button
            type="button"
            onClick={() => {
              addMatchFormRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              })
              addMatchFormRef.current?.querySelector("input")?.focus()
            }}
            className="flex items-center gap-2 rounded-[30px] bg-primary px-5 py-2.5 font-display text-sm text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none"
            style={{ fontWeight: 700 }}
          >
            <Plus size={16} />
            快速添加
          </button>
        </div>
      </div>

      {/* Bento grid */}
      <div className="mb-10 grid gap-4 xl:grid-cols-3">
        {/* ADD NEW MATCH card */}
        <div
          ref={addMatchFormRef}
          className="rounded-lg border-1 border-border p-5 transition-shadow md:p-6 xl:col-span-2"
        >
          <div className="mb-5 flex items-center gap-2">
            <IoCalendarOutline className="size-5 text-foreground" />
            <h2
              className="font-display text-lg tracking-wide"
              style={{ fontWeight: 900 }}
            >
              添加新比赛
            </h2>
          </div>
          <form ref={createFormRef} onSubmit={handleCreate}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="match_date"
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
                >
                  比赛时间
                </label>
                <input
                  id="match_date"
                  name="match_date"
                  type="datetime-local"
                  required
                  className="w-full rounded-lg border-1 border-input bg-background px-4 py-2.5 text-sm transition-colors focus:border-ring focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                />
              </div>
              <div>
                <label
                  htmlFor="away_team"
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
                >
                  对手
                </label>
                <input
                  id="away_team"
                  name="away_team"
                  required
                  placeholder="输入对手名称..."
                  className="w-full rounded-lg border-1 border-input bg-background px-4 py-2.5 text-sm transition-colors placeholder:text-muted-foreground focus:border-ring focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                />
              </div>
              <div>
                <label
                  htmlFor="home_team"
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
                >
                  主队
                </label>
                <input
                  id="home_team"
                  name="home_team"
                  required
                  defaultValue="鹏飏"
                  className="w-full rounded-lg border-1 border-input bg-background px-4 py-2.5 text-sm transition-colors focus:border-ring focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="precautions"
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
                >
                  注意事项与备注
                </label>
                <textarea
                  id="precautions"
                  name="precautions"
                  rows={3}
                  placeholder="输入关键注意事项、球员部署等..."
                  className="w-full resize-none rounded-lg border-1 border-input bg-background px-4 py-2.5 text-sm transition-colors placeholder:text-muted-foreground focus:border-ring focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="is_public"
                  className="flex items-start gap-3 rounded-lg border-1 border-border bg-background p-4 transition-colors hover:border-ring"
                >
                  <Checkbox id="is_public" name="is_public" defaultChecked />
                  <span className="flex flex-col gap-1">
                    <span
                      className="font-display text-sm tracking-wide text-foreground"
                      style={{ fontWeight: 700 }}
                    >
                      公开展示比赛数据
                    </span>
                    <span className="font-body text-xs text-muted-foreground">
                      关闭后，公众页面将隐藏该比赛的赛程、比分、动态和媒体。
                    </span>
                  </span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="mt-4 w-full rounded-[30px] bg-primary py-3 font-display text-sm tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none"
              style={{ fontWeight: 700 }}
            >
              {createMutation.isPending ? "发布中..." : "发布比赛"}
            </button>
          </form>
        </div>

        {/* LIVE SCORE card */}
        <LiveScoreWidget
          match={liveMatch ?? null}
          onUpdateScore={(id, home, away) =>
            updateMutation.mutate({
              id,
              body: { home_score: home, away_score: away },
            })
          }
          onFinalize={(id) =>
            updateMutation.mutate({ id, body: { status: "completed" } })
          }
        />
      </div>

      {/* Media upload for expanded match */}
      {expandedId && (
        <div className="mb-10">
          <MediaUploadCard matchId={expandedId} />
        </div>
      )}

      {/* Match list */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="font-display text-lg tracking-wide"
            style={{ fontWeight: 900 }}
          >
            比赛列表
          </h2>
          <div className="flex gap-1.5">
            {[
              { value: "" as const, label: "全部" },
              { value: "upcoming" as const, label: "即将开始" },
              { value: "live" as const, label: "进行中" },
              { value: "completed" as const, label: "已结束" },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value as MatchStatus | "")}
                className={`rounded-[30px] px-4 py-1.5 font-display text-xs tracking-wide transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  statusFilter === tab.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
                style={{ fontWeight: 700 }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : data?.data && data.data.length > 0 ? (
          <div className="space-y-3">
            {data.data.map((match) => (
              <div
                key={match.id}
                data-testid="match-row"
                className="rounded-lg border-muted-foreground bg-card p-4 md:p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${STATUS_COLORS[match.status as MatchStatus] ?? ""}`}
                    >
                      {match.status === "live" && <PulsingDot />}
                      {STATUS_LABELS[match.status as MatchStatus] ??
                        match.status}
                    </span>
                    <span className="inline-flex rounded-full border border-border bg-muted px-3 py-1 text-[10px] font-semibold tracking-wide text-muted-foreground">
                      {match.is_public === false ? "未公开" : "公开"}
                    </span>
                    <div>
                      <p
                        className="font-display text-sm tracking-tight"
                        style={{ fontWeight: 700 }}
                      >
                        {match.home_team} vs {match.away_team}
                        {(match.home_score != null ||
                          match.away_score != null) && (
                          <span className="ml-2 tabular-nums">
                            {match.home_score ?? 0} - {match.away_score ?? 0}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(match.match_date).toLocaleString("zh-CN", {
                          timeZone: "Asia/Shanghai",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleSetExpandedId(
                          expandedId === match.id ? null : match.id,
                        )
                      }
                      className={`rounded-[30px] border-1 px-4 py-1.5 font-display text-[10px] tracking-wide transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        expandedId === match.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-ring hover:text-foreground"
                      }`}
                      style={{ fontWeight: 700 }}
                    >
                      {expandedId === match.id ? "收起" : "动态 / 媒体"}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(match.id, match.status)}
                      className="rounded-[30px] border-1 border-border px-4 py-1.5 font-display text-[10px] tracking-wide text-muted-foreground transition-colors hover:border-ring hover:text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      style={{ fontWeight: 700 }}
                    >
                      {match.status === "upcoming"
                        ? "开始比赛"
                        : match.status === "live"
                          ? "结束比赛"
                          : "重置"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetEditingId(match.id)}
                      className="rounded-[30px] border-1 border-border px-4 py-1.5 font-display text-[10px] tracking-wide text-muted-foreground transition-colors hover:border-ring hover:text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      style={{ fontWeight: 700 }}
                    >
                      编辑
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          className="rounded-[30px] border-1 border-destructive/30 px-4 py-1.5 font-display text-[10px] tracking-wide text-destructive transition-colors hover:border-destructive hover:bg-destructive hover:text-white outline-none focus-visible:ring-1 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          style={{ fontWeight: 700 }}
                        >
                          删除
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认删除</AlertDialogTitle>
                          <AlertDialogDescription>
                            确定要删除比赛「{match.home_team} vs{" "}
                            {match.away_team}
                            」吗？关联的动态和媒体也将被删除，此操作无法撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(match.id)}
                            className="bg-destructive text-white hover:bg-destructive/90"
                          >
                            删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/* Expanded panel: updates + media */}
                {expandedId === match.id && (
                  <div className="mt-4 space-y-6 border-t-2 border-border pt-4">
                    <MatchUpdatesPanel matchId={match.id} />
                  </div>
                )}

                {/* Edit inline */}
                {editingId === match.id && (
                  <EditMatchInline
                    match={match}
                    onSave={(body) =>
                      updateMutation.mutate({ id: match.id, body })
                    }
                    onCancel={() => setEditingId(null)}
                    isPending={updateMutation.isPending}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border-1 border-dashed border-border px-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              暂无比赛，使用上方表单创建
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
