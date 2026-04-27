import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { PlayersService } from "@/client"
import { Button } from "@/components/ui/button"
import useCustomToast from "@/hooks/useCustomToast"

export const Route = createFileRoute("/_layout/players")({
  component: PlayersManagement,
  head: () => ({ meta: [{ title: "球员管理 - 鹏飏" }] }),
})

function PlayersManagement() {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["admin-players"],
    queryFn: () => PlayersService.listPlayers(),
  })

  const deleteMutation = useMutation({
    mutationFn: (playerId: string) => PlayersService.deletePlayer({ playerId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-players"] })
      showSuccessToast("球员已删除")
    },
    onError: () => showErrorToast("删除失败"),
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const payload = {
      name: formData.get("name") as string,
      first_name: formData.get("first_name") as string,
      position: (formData.get("position") as string) || undefined,
      jersey_number: formData.get("jersey_number")
        ? Number(formData.get("jersey_number"))
        : undefined,
      biography: (formData.get("biography") as string) || undefined,
      has_parental_consent: formData.get("has_parental_consent") === "on",
      sort_order: Number(formData.get("sort_order") || 0),
      photo: formData.get("photo") as File | undefined,
    }
    try {
      if (editingId) {
        await PlayersService.updatePlayer({
          playerId: editingId,
          formData: payload,
        })
        showSuccessToast("球员已更新")
      } else {
        await PlayersService.createPlayer({ formData: payload })
        showSuccessToast("球员已添加")
      }
      queryClient.invalidateQueries({ queryKey: ["admin-players"] })
      setShowForm(false)
      setEditingId(null)
    } catch {
      showErrorToast("操作失败，请重试")
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">球员管理</h1>
        <Button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
          }}
        >
          添加球员
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-lg border border-border bg-card p-6"
        >
          <h2 className="mb-4 text-lg font-semibold">
            {editingId ? "编辑球员" : "添加球员"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                全名
              </label>
              <input
                id="name"
                name="name"
                required
                className="w-full rounded-lg border border-input bg-background px-4 py-2 transition-colors focus:border-ring focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
              />
            </div>
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium mb-1"
              >
                名 (公开显示)
              </label>
              <input
                id="first_name"
                name="first_name"
                required
                className="w-full rounded-lg border border-input bg-background px-4 py-2 transition-colors focus:border-ring focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
              />
            </div>
            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium mb-1"
              >
                位置
              </label>
              <input
                id="position"
                name="position"
                className="w-full rounded-lg border border-input bg-background px-4 py-2 transition-colors placeholder:text-muted-foreground focus:border-ring focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                placeholder="如：前锋、守门员"
              />
            </div>
            <div>
              <label
                htmlFor="jersey_number"
                className="block text-sm font-medium mb-1"
              >
                球衣号码
              </label>
              <input
                id="jersey_number"
                name="jersey_number"
                type="number"
                min={1}
                max={99}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 transition-colors focus:border-ring focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="biography"
                className="block text-sm font-medium mb-1"
              >
                简介
              </label>
              <textarea
                id="biography"
                name="biography"
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 transition-colors focus:border-ring focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
              />
            </div>
            <div>
              <label
                htmlFor="sort_order"
                className="block text-sm font-medium mb-1"
              >
                排序
              </label>
              <input
                id="sort_order"
                name="sort_order"
                type="number"
                defaultValue={0}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 transition-colors focus:border-ring focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
              />
            </div>
            <div>
              <label htmlFor="photo" className="block text-sm font-medium mb-1">
                照片
              </label>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <input
                id="has_parental_consent"
                name="has_parental_consent"
                type="checkbox"
                className="size-5 rounded border-input accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
              />
              <label
                htmlFor="has_parental_consent"
                className="text-sm font-medium"
              >
                家长已授权公开完整资料
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button type="submit">保存</Button>
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
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <div className="space-y-3">
          {data.data.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center gap-4">
                {player.photo_url ? (
                  <img
                    src={player.photo_url}
                    alt={player.name}
                    loading="lazy"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground font-bold">
                    {player.jersey_number ?? player.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold">
                    {player.name}
                    {player.jersey_number != null && (
                      <span className="ml-2 text-muted-foreground">
                        #{player.jersey_number}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {player.position || "未设置位置"} ·{" "}
                    {player.has_parental_consent ? "已授权" : "未授权"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingId(player.id)
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
                        `确定要删除球员「${player.name}」吗？此操作不可撤销。`,
                      )
                    )
                      deleteMutation.mutate(player.id)
                  }}
                >
                  删除
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">暂无球员，点击"添加球员"开始</p>
      )}
    </div>
  )
}
