import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Minus, Plus } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import type {
  MatchCreate,
  MatchPatch,
  MatchPublic,
  MatchStatus,
} from "@/client"
import {
  MatchesService,
  MatchMediaService,
  MatchUpdatesService,
  PublicService,
} from "@/client"
import { PulsingDot } from "@/components/Public/PulsingDot"
import useCustomToast from "@/hooks/useCustomToast"

export const Route = createFileRoute("/_layout/match-management")({
  component: MatchesManagement,
  head: () => ({ meta: [{ title: "比赛管理 - 鹏飏" }] }),
})

const STATUS_LABELS: Record<string, string> = {
  upcoming: "即将开始",
  live: "进行中",
  completed: "已结束",
}

const STATUS_COLORS: Record<string, string> = {
  upcoming: "bg-[#111111] text-white",
  live: "bg-[#FA5400] text-white",
  completed: "bg-[#F5F5F5] text-[#707072]",
}

function MatchesManagement() {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<MatchStatus | "">("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const addMatchFormRef = useRef<HTMLDivElement>(null)

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
    const fd = new FormData(e.currentTarget)
    const body: MatchCreate = {
      match_date: fd.get("match_date") as string,
      home_team: fd.get("home_team") as string,
      away_team: fd.get("away_team") as string,
      precautions: (fd.get("precautions") as string) || undefined,
    }
    createMutation.mutate(body)
    e.currentTarget.reset()
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
        <p className="mb-1 font-body text-xs uppercase tracking-[0.15em] text-[#FA5400]">
          比赛管理
        </p>
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
              addMatchFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
              addMatchFormRef.current?.querySelector("input")?.focus()
            }}
            className="flex items-center gap-2 rounded-[30px] bg-[#111111] px-5 py-2.5 font-display text-sm text-white transition-colors hover:bg-[#292929]"
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
          className="rounded-lg border-2 border-[#111111] p-5 transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] md:p-6 xl:col-span-2"
        >
          <div className="mb-5 flex items-center gap-2">
            <svg
              className="h-5 w-5 text-[#111111]"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
            </svg>
            <h2
              className="font-display text-lg tracking-wide"
              style={{ fontWeight: 900 }}
            >
              添加新比赛
            </h2>
          </div>
          <form onSubmit={handleCreate}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="match_date"
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]"
                >
                  比赛时间
                </label>
                <input
                  id="match_date"
                  name="match_date"
                  type="datetime-local"
                  required
                  className="w-full rounded-lg border-2 border-[#E5E5E5] bg-white px-4 py-2.5 text-sm transition-colors focus:border-[#111111] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="away_team"
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]"
                >
                  对手
                </label>
                <input
                  id="away_team"
                  name="away_team"
                  required
                  placeholder="输入对手名称..."
                  className="w-full rounded-lg border-2 border-[#E5E5E5] bg-white px-4 py-2.5 text-sm transition-colors placeholder:text-[#B0B0B0] focus:border-[#111111] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="home_team"
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]"
                >
                  主队
                </label>
                <input
                  id="home_team"
                  name="home_team"
                  required
                  defaultValue="观湖实验"
                  className="w-full rounded-lg border-2 border-[#E5E5E5] bg-white px-4 py-2.5 text-sm transition-colors focus:border-[#111111] focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="precautions"
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]"
                >
                  注意事项与备注
                </label>
                <textarea
                  id="precautions"
                  name="precautions"
                  rows={3}
                  placeholder="输入关键注意事项、球员部署等..."
                  className="w-full resize-none rounded-lg border-2 border-[#E5E5E5] bg-white px-4 py-2.5 text-sm transition-colors placeholder:text-[#B0B0B0] focus:border-[#111111] focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="mt-4 w-full rounded-[30px] bg-[#111111] py-3 font-display text-sm tracking-wide text-white transition-colors hover:bg-[#292929] disabled:opacity-50"
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
                className={`rounded-[30px] px-4 py-1.5 font-display text-xs tracking-wide transition-colors ${
                  statusFilter === tab.value
                    ? "bg-[#111111] text-white"
                    : "bg-[#F5F5F5] text-[#707072] hover:bg-[#E5E5E5]"
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
              <div
                key={i}
                className="h-20 animate-pulse rounded-lg bg-[#F5F5F5]"
              />
            ))}
          </div>
        ) : data?.data && data.data.length > 0 ? (
          <div className="space-y-3">
            {data.data.map((match) => (
              <div
                key={match.id}
                className="rounded-lg border-2 border-[#E5E5E5] p-4 transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] md:p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${STATUS_COLORS[match.status] || ""}`}
                    >
                      {match.status === "live" && <PulsingDot />}
                      {STATUS_LABELS[match.status] || match.status}
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
                      <p className="text-xs text-[#707072]">
                        {new Date(match.match_date).toLocaleString("zh-CN")}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleSetExpandedId(expandedId === match.id ? null : match.id)
                      }
                      className={`rounded-[30px] border-2 px-4 py-1.5 font-display text-[10px] tracking-wide transition-colors ${
                        expandedId === match.id
                          ? "border-[#111111] bg-[#111111] text-white"
                          : "border-[#E5E5E5] text-[#707072] hover:border-[#111111] hover:text-[#111111]"
                      }`}
                      style={{ fontWeight: 700 }}
                    >
                      {expandedId === match.id ? "收起" : "动态 / 媒体"}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(match.id, match.status)}
                      className="rounded-[30px] border-2 border-[#E5E5E5] px-4 py-1.5 font-display text-[10px] tracking-wide text-[#707072] transition-colors hover:border-[#111111] hover:text-[#111111]"
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
                      className="rounded-[30px] border-2 border-[#E5E5E5] px-4 py-1.5 font-display text-[10px] tracking-wide text-[#707072] transition-colors hover:border-[#111111] hover:text-[#111111]"
                      style={{ fontWeight: 700 }}
                    >
                      编辑
                    </button>
                    <button
                      type="button"
                      className="rounded-[30px] border-2 border-red-200 px-4 py-1.5 font-display text-[10px] tracking-wide text-red-500 transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white"
                      style={{ fontWeight: 700 }}
                      onClick={() => {
                        if (
                          window.confirm(
                            `确定要删除比赛「${match.home_team} vs ${match.away_team}」吗？关联的动态和媒体也将被删除。`,
                          )
                        )
                          deleteMutation.mutate(match.id)
                      }}
                    >
                      删除
                    </button>
                  </div>
                </div>

                {/* Expanded panel: updates + media */}
                {expandedId === match.id && (
                  <div className="mt-4 space-y-6 border-t-2 border-[#E5E5E5] pt-4">
                    <MatchUpdatesPanel matchId={match.id} />
                  </div>
                )}

                {/* Edit modal inline */}
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
          <div className="rounded-lg border-2 border-dashed border-[#E5E5E5] px-4 py-12 text-center">
            <p className="text-sm text-[#707072]">暂无比赛，使用上方表单创建</p>
          </div>
        )}
      </div>
    </div>
  )
}

function LiveScoreWidget({
  match,
  onUpdateScore,
  onFinalize,
}: {
  match: MatchPublic | null
  onUpdateScore: (id: string, home: number, away: number) => void
  onFinalize: (id: string) => void
}) {
  const homeScore = match?.home_score ?? 0
  const awayScore = match?.away_score ?? 0

  return (
    <div className="flex flex-col rounded-lg border-2 border-[#E5E5E5] p-5 md:p-6 xl:col-span-1">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-[#111111]"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M3.33 16.67c0-1.47.58-2.87 1.63-3.92L12 5.71l7.04 7.04a5.55 5.55 0 0 1-7.85 7.85L7.25 16.67a5.55 5.55 0 0 0-3.92 0zM12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
          </svg>
          <h2
            className="font-display text-lg tracking-wide"
            style={{ fontWeight: 900 }}
          >
            实时比分
          </h2>
        </div>
        {match && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FA5400] px-3 py-1 text-[10px] font-semibold text-white">
            <PulsingDot />
            进行中
          </span>
        )}
      </div>

      {match ? (
        <div className="flex flex-1 flex-col">
          {/* Home score */}
          <div className="mb-1 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]">
              {match.home_team}（主场）
            </p>
          </div>
          <div className="mb-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                onUpdateScore(match.id, Math.max(0, homeScore - 1), awayScore)
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#E5E5E5] transition-colors hover:border-[#111111]"
            >
              <Minus size={16} />
            </button>
            <span
              className="w-16 text-center font-display text-5xl tabular-nums"
              style={{ fontWeight: 900 }}
            >
              {homeScore}
            </span>
            <button
              type="button"
              onClick={() => onUpdateScore(match.id, homeScore + 1, awayScore)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#E5E5E5] transition-colors hover:border-[#111111]"
            >
              <Plus size={16} />
            </button>
          </div>

          <p
            className="mb-4 text-center font-display text-lg text-[#E5E5E5]"
            style={{ fontWeight: 900 }}
          >
            VS
          </p>

          {/* Away score */}
          <div className="mb-1 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]">
              {match.away_team}（客场）
            </p>
          </div>
          <div className="mb-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                onUpdateScore(match.id, homeScore, Math.max(0, awayScore - 1))
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#E5E5E5] transition-colors hover:border-[#111111]"
            >
              <Minus size={16} />
            </button>
            <span
              className="w-16 text-center font-display text-5xl tabular-nums text-[#707072]"
              style={{ fontWeight: 900 }}
            >
              {awayScore}
            </span>
            <button
              type="button"
              onClick={() => onUpdateScore(match.id, homeScore, awayScore + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#E5E5E5] transition-colors hover:border-[#111111]"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onFinalize(match.id)}
            className="mt-auto w-full rounded-[30px] border-2 border-[#111111] py-2.5 font-display text-xs tracking-wide transition-colors hover:bg-[#111111] hover:text-white"
            style={{ fontWeight: 700 }}
          >
            结束比赛
          </button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center py-8">
          <p className="text-center text-sm text-[#707072]">暂无进行中的比赛</p>
          <p className="mt-1 text-center text-xs text-[#B0B0B0]">
            在比赛列表中点击"开始比赛"以启用实时比分
          </p>
        </div>
      )}
    </div>
  )
}

function MediaUploadCard({ matchId }: { matchId: string }) {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const [videoUrl, setVideoUrl] = useState("")
  const [videoTitle, setVideoTitle] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["match-detail", matchId],
    queryFn: () => PublicService.getMatchDetail({ matchId }),
  })

  const uploadPhotoMutation = useMutation({
    mutationFn: (file: File) =>
      MatchMediaService.uploadMatchPhoto({
        matchId,
        formData: { photo: file },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match-detail", matchId] })
      showSuccessToast("照片已上传")
    },
    onError: () => showErrorToast("上传失败"),
  })

  const addVideoMutation = useMutation({
    mutationFn: () =>
      MatchMediaService.addMatchVideoLink({
        matchId,
        requestBody: { url: videoUrl, title: videoTitle || undefined },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match-detail", matchId] })
      setVideoUrl("")
      setVideoTitle("")
      showSuccessToast("视频链接已添加")
    },
    onError: () => showErrorToast("添加失败"),
  })

  const deleteMutation = useMutation({
    mutationFn: (mediaId: string) =>
      MatchMediaService.deleteMatchMedia({ matchId, mediaId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match-detail", matchId] })
      showSuccessToast("已删除")
    },
    onError: () => showErrorToast("删除失败"),
  })

  const handleFiles = async (files: FileList | null) => {
    if (!files) return
    const images = Array.from(files).filter((f) => f.type.startsWith("image/"))
    for (const file of images) {
      try {
        await uploadPhotoMutation.mutateAsync(file)
      } catch {
        // error already handled by onError callback
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const mediaItems = data?.media ?? []

  return (
    <div className="rounded-lg border-2 border-[#E5E5E5] p-5 md:p-6">
      <div className="mb-5 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-[#111111]"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z" />
        </svg>
        <h2
          className="font-display text-lg tracking-wide"
          style={{ fontWeight: 900 }}
        >
          媒体上传
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Dropzone */}
        <button
          type="button"
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
            isDragOver
              ? "border-[#FA5400] bg-[#FA5400]/5"
              : "border-[#E5E5E5] hover:border-[#111111]"
          }`}
        >
          <svg
            className="mb-2 h-10 w-10 text-[#B0B0B0]"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
          </svg>
          <p
            className="font-display text-sm tracking-wide"
            style={{ fontWeight: 700 }}
          >
            拖拽文件至此
          </p>
          <p className="mt-1 text-xs text-[#B0B0B0]">
            照片（最大 10MB，支持 JPEG / PNG / WebP）
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files)
              e.target.value = ""
            }}
          />
        </button>

        {/* Preview grid + video form */}
        <div className="space-y-3">
          {/* Video link form */}
          <div className="flex gap-2">
            <input
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="视频标题"
              className="w-28 rounded-lg border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm transition-colors focus:border-[#111111] focus:outline-none"
            />
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="视频链接 (如Bilibili)"
              className="flex-1 rounded-lg border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm transition-colors focus:border-[#111111] focus:outline-none"
            />
            <button
              type="button"
              disabled={!videoUrl.trim()}
              onClick={() => addVideoMutation.mutate()}
              className="shrink-0 rounded-[30px] bg-[#111111] px-4 py-2 font-display text-xs tracking-wide text-white transition-colors hover:bg-[#292929] disabled:opacity-50"
              style={{ fontWeight: 700 }}
            >
              添加
            </button>
          </div>

          {/* Media preview grid */}
          {isLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded bg-[#F5F5F5]"
                />
              ))}
            </div>
          ) : mediaItems.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {mediaItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded bg-[#F5F5F5]"
                >
                  {item.media_type === "photo" && item.file_path ? (
                    <img
                      src={item.file_path}
                      alt={item.caption || ""}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-2">
                      <svg
                        className="mb-1 h-6 w-6 text-[#707072]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span className="truncate text-[10px] text-[#707072]">
                        {item.title || "视频"}
                      </span>
                    </div>
                  )}
                  <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-white">
                    {item.media_type === "photo" ? "图片" : "视频"}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="删除"
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="flex aspect-square items-center justify-center rounded border-2 border-dashed border-[#E5E5E5]">
                <span className="text-xs text-[#B0B0B0]">空位</span>
              </div>
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded border-2 border-dashed border-[#E5E5E5]">
              <span className="text-xs text-[#B0B0B0]">暂无媒体</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EditMatchInline({
  match,
  onSave,
  onCancel,
  isPending,
}: {
  match: MatchPublic
  onSave: (body: MatchPatch) => void
  onCancel: () => void
  isPending: boolean
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const body: MatchPatch = {
      match_date: (fd.get("match_date") as string) || undefined,
      home_team: (fd.get("home_team") as string) || undefined,
      away_team: (fd.get("away_team") as string) || undefined,
      precautions: (fd.get("precautions") as string) || undefined,
      home_score: fd.get("home_score")
        ? Number(fd.get("home_score"))
        : undefined,
      away_score: fd.get("away_score")
        ? Number(fd.get("away_score"))
        : undefined,
    }
    onSave(body)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 border-t-2 border-[#E5E5E5] pt-4"
    >
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label
            htmlFor="edit_match_date"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]"
          >
            比赛时间
          </label>
          <input
            id="edit_match_date"
            name="match_date"
            type="datetime-local"
            defaultValue={match.match_date.slice(0, 16)}
            className="w-full rounded-lg border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm focus:border-[#111111] focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="edit_home_team"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]"
          >
            主队
          </label>
          <input
            id="edit_home_team"
            name="home_team"
            defaultValue={match.home_team}
            className="w-full rounded-lg border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm focus:border-[#111111] focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="edit_away_team"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]"
          >
            客队
          </label>
          <input
            id="edit_away_team"
            name="away_team"
            defaultValue={match.away_team}
            className="w-full rounded-lg border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm focus:border-[#111111] focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="edit_home_score"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]"
          >
            主队比分
          </label>
          <input
            id="edit_home_score"
            name="home_score"
            type="number"
            min={0}
            defaultValue={match.home_score ?? ""}
            className="w-full rounded-lg border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm focus:border-[#111111] focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="edit_away_score"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]"
          >
            客队比分
          </label>
          <input
            id="edit_away_score"
            name="away_score"
            type="number"
            min={0}
            defaultValue={match.away_score ?? ""}
            className="w-full rounded-lg border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm focus:border-[#111111] focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="edit_precautions"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#707072]"
          >
            注意事项
          </label>
          <input
            id="edit_precautions"
            name="precautions"
            defaultValue={match.precautions ?? ""}
            className="w-full rounded-lg border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm focus:border-[#111111] focus:outline-none"
          />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-[30px] bg-[#111111] px-5 py-2 font-display text-xs tracking-wide text-white transition-colors hover:bg-[#292929] disabled:opacity-50"
          style={{ fontWeight: 700 }}
        >
          保存
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-[30px] border-2 border-[#E5E5E5] px-5 py-2 font-display text-xs tracking-wide text-[#707072] transition-colors hover:border-[#111111] hover:text-[#111111]"
          style={{ fontWeight: 700 }}
        >
          取消
        </button>
      </div>
    </form>
  )
}

function MatchUpdatesPanel({ matchId }: { matchId: string }) {
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
          className="flex-1 rounded-lg border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm transition-colors focus:border-[#111111] focus:outline-none"
        />
        <button
          type="button"
          disabled={!content.trim()}
          onClick={() => createMutation.mutate()}
          className="shrink-0 rounded-[30px] bg-[#111111] px-4 py-2 font-display text-xs tracking-wide text-white transition-colors hover:bg-[#292929] disabled:opacity-50"
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
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              <button
                type="button"
                className="ml-2 text-xs text-red-500 hover:underline"
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
