import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import type { MatchCreate, MatchPatch, MatchStatus } from "@/client"
import {
  MatchesService,
  MatchMediaService,
  MatchUpdatesService,
  PublicService,
} from "@/client"
import { Button } from "@/components/ui/button"
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
  upcoming: "bg-blue-100 text-blue-800",
  live: "bg-[#FA5400]/10 text-[#FA5400]",
  completed: "bg-gray-100 text-gray-600",
}

function MatchesManagement() {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<MatchStatus | "">("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

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
      setShowForm(false)
    },
    onError: () => showErrorToast("创建失败"),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: MatchPatch }) =>
      MatchesService.updateMatch({ matchId: id, requestBody: body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-matches"] })
      showSuccessToast("比赛已更新")
      setShowForm(false)
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (editingId) {
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
      updateMutation.mutate({ id: editingId, body })
    } else {
      const body: MatchCreate = {
        match_date: fd.get("match_date") as string,
        home_team: fd.get("home_team") as string,
        away_team: fd.get("away_team") as string,
        precautions: (fd.get("precautions") as string) || undefined,
      }
      createMutation.mutate(body)
    }
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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">比赛管理</h1>
        <Button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
          }}
          className="bg-[#111111] text-white hover:bg-[#292929]"
        >
          创建比赛
        </Button>
      </div>

      {/* Status filter tabs */}
      <div className="mb-6 flex gap-2">
        {[
          { value: "", label: "全部" },
          { value: "upcoming", label: "即将开始" },
          { value: "live", label: "进行中" },
          { value: "completed", label: "已结束" },
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setStatusFilter(tab.value as MatchStatus | "")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              statusFilter === tab.value
                ? "bg-[#111111] text-white"
                : "bg-[#F5F5F5] text-[#707072] hover:bg-[#E5E5E5]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-lg border border-[#E5E5E5] p-6"
        >
          <h2 className="mb-4 text-lg font-semibold">
            {editingId ? "编辑比赛" : "创建比赛"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="match_date"
                className="block text-sm font-medium mb-1"
              >
                比赛时间
              </label>
              <input
                id="match_date"
                name="match_date"
                type="datetime-local"
                required
                className="w-full rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] px-4 py-2"
              />
            </div>
            <div>
              <label
                htmlFor="home_team"
                className="block text-sm font-medium mb-1"
              >
                主队
              </label>
              <input
                id="home_team"
                name="home_team"
                required
                className="w-full rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] px-4 py-2"
              />
            </div>
            <div>
              <label
                htmlFor="away_team"
                className="block text-sm font-medium mb-1"
              >
                客队
              </label>
              <input
                id="away_team"
                name="away_team"
                required
                className="w-full rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] px-4 py-2"
              />
            </div>
            <div>
              <label
                htmlFor="precautions"
                className="block text-sm font-medium mb-1"
              >
                注意事项
              </label>
              <input
                id="precautions"
                name="precautions"
                className="w-full rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] px-4 py-2"
              />
            </div>
            {editingId && (
              <>
                <div>
                  <label
                    htmlFor="home_score"
                    className="block text-sm font-medium mb-1"
                  >
                    主队比分
                  </label>
                  <input
                    id="home_score"
                    name="home_score"
                    type="number"
                    min={0}
                    className="w-full rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] px-4 py-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="away_score"
                    className="block text-sm font-medium mb-1"
                  >
                    客队比分
                  </label>
                  <input
                    id="away_score"
                    name="away_score"
                    type="number"
                    min={0}
                    className="w-full rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] px-4 py-2"
                  />
                </div>
              </>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              type="submit"
              className="bg-[#111111] text-white hover:bg-[#292929]"
            >
              保存
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
              }}
            >
              取消
            </Button>
          </div>
        </form>
      )}

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
              className="rounded-lg border border-[#E5E5E5] p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[match.status] || ""}`}
                  >
                    {STATUS_LABELS[match.status] || match.status}
                  </span>
                  <div>
                    <p className="font-semibold">
                      {match.home_team} vs {match.away_team}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(match.match_date).toLocaleString("zh-CN")}
                      {(match.home_score != null || match.away_score != null) &&
                        ` · ${match.home_score ?? 0} - ${match.away_score ?? 0}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setExpandedId(expandedId === match.id ? null : match.id)
                    }
                  >
                    动态
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatus(match.id, match.status)}
                    title="切换状态"
                  >
                    {match.status === "upcoming"
                      ? "开始"
                      : match.status === "live"
                        ? "结束"
                        : "重置"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(match.id)
                      setShowForm(true)
                    }}
                  >
                    编辑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
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
                  </Button>
                </div>
              </div>
              {expandedId === match.id && (
                <div className="mt-4 space-y-6 border-t border-[#E5E5E5] pt-4">
                  <MatchUpdatesPanel matchId={match.id} />
                  <MatchMediaPanel matchId={match.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">暂无比赛，点击"创建比赛"开始</p>
      )}
    </div>
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
    <div className="mt-4 border-t border-[#E5E5E5] pt-4">
      <div className="mb-3 flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="输入比赛动态..."
          className="flex-1 rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] px-3 py-2 text-sm"
        />
        <Button
          size="sm"
          className="bg-[#111111] text-white hover:bg-[#292929]"
          disabled={!content.trim()}
          onClick={() => createMutation.mutate()}
        >
          发布
        </Button>
      </div>
      {isLoading ? (
        <div className="h-8 animate-pulse rounded bg-muted" />
      ) : data?.data && data.data.length > 0 ? (
        <div className="space-y-2">
          {data.data.map((update) => (
            <div
              key={update.id}
              className="flex items-start justify-between rounded bg-[#F5F5F5] px-3 py-2 text-sm"
            >
              <div>
                <p>{update.content}</p>
                <time className="text-xs text-[#707072]">
                  {new Date(update.created_at).toLocaleTimeString("zh-CN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              <button
                type="button"
                className="ml-2 text-xs text-destructive hover:underline"
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

function MatchMediaPanel({ matchId }: { matchId: string }) {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const [videoUrl, setVideoUrl] = useState("")
  const [videoTitle, setVideoTitle] = useState("")

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadPhotoMutation.mutate(file)
    e.target.value = ""
  }

  const mediaItems = data?.media ?? []

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold">媒体</h3>

      {/* Upload photo */}
      <div className="mb-3 flex items-center gap-2">
        <label className="cursor-pointer rounded-lg bg-[#F5F5F5] px-3 py-2 text-sm hover:bg-[#E5E5E5]">
          上传照片
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </label>
      </div>

      {/* Add video link */}
      <div className="mb-3 flex gap-2">
        <input
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          placeholder="视频标题"
          className="w-32 rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] px-3 py-2 text-sm"
        />
        <input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="视频链接 (如Bilibili)"
          className="flex-1 rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] px-3 py-2 text-sm"
        />
        <Button
          size="sm"
          className="bg-[#111111] text-white hover:bg-[#292929]"
          disabled={!videoUrl.trim()}
          onClick={() => addVideoMutation.mutate()}
        >
          添加
        </Button>
      </div>

      {/* Media list */}
      {isLoading ? (
        <div className="h-8 animate-pulse rounded bg-muted" />
      ) : mediaItems.length > 0 ? (
        <div className="space-y-2">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded bg-[#F5F5F5] px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="rounded bg-white px-2 py-0.5 text-xs font-medium">
                  {item.media_type === "photo" ? "照片" : "视频"}
                </span>
                <span className="truncate">
                  {item.title || item.caption || item.file_path || item.url}
                </span>
              </div>
              <button
                type="button"
                className="ml-2 text-xs text-destructive hover:underline"
                onClick={() => deleteMutation.mutate(item.id)}
              >
                删除
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">暂无媒体</p>
      )}
    </div>
  )
}
