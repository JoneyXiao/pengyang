import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { CoachesService } from "@/client"
import { Button } from "@/components/ui/button"
import useCustomToast from "@/hooks/useCustomToast"

export const Route = createFileRoute("/_layout/coaches")({
  component: CoachesManagement,
  head: () => ({ meta: [{ title: "教练管理 - 鹏飏" }] }),
})

function CoachesManagement() {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["admin-coaches"],
    queryFn: () => CoachesService.listCoaches(),
  })

  const deleteMutation = useMutation({
    mutationFn: (coachId: string) => CoachesService.deleteCoach({ coachId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coaches"] })
      showSuccessToast("教练已删除")
    },
    onError: () => showErrorToast("删除失败"),
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      if (editingId) {
        await CoachesService.updateCoach({
          coachId: editingId,
          formData: {
            name: formData.get("name") as string,
            role: formData.get("role") as string,
            biography: (formData.get("biography") as string) || undefined,
            sort_order: Number(formData.get("sort_order") || 0),
            photo: formData.get("photo") as File | undefined,
          },
        })
        showSuccessToast("教练已更新")
      } else {
        await CoachesService.createCoach({
          formData: {
            name: formData.get("name") as string,
            role: formData.get("role") as string,
            biography: (formData.get("biography") as string) || undefined,
            sort_order: Number(formData.get("sort_order") || 0),
            photo: formData.get("photo") as File | undefined,
          },
        })
        showSuccessToast("教练已添加")
      }
      queryClient.invalidateQueries({ queryKey: ["admin-coaches"] })
      setShowForm(false)
      setEditingId(null)
    } catch {
      showErrorToast("操作失败，请重试")
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">教练管理</h1>
        <Button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
          }}
          className="bg-[#111111] text-white hover:bg-[#292929]"
        >
          添加教练
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-lg border border-[#E5E5E5] p-6"
        >
          <h2 className="mb-4 text-lg font-semibold">
            {editingId ? "编辑教练" : "添加教练"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                姓名
              </label>
              <input
                id="name"
                name="name"
                required
                className="w-full rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] px-4 py-2"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-1">
                职务
              </label>
              <input
                id="role"
                name="role"
                required
                className="w-full rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] px-4 py-2"
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
                className="w-full rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] px-4 py-2"
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
                className="w-full rounded-lg border border-[#E5E5E5] bg-[#F5F5F5] px-4 py-2"
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
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <div className="space-y-3">
          {data.data.map((coach) => (
            <div
              key={coach.id}
              className="flex items-center justify-between rounded-lg border border-[#E5E5E5] p-4"
            >
              <div className="flex items-center gap-4">
                {coach.photo_url ? (
                  <img
                    src={coach.photo_url}
                    alt={coach.name}
                    loading="lazy"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F5] text-[#707072] font-bold">
                    {coach.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{coach.name}</p>
                  <p className="text-sm text-muted-foreground">{coach.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingId(coach.id)
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
                        `确定要删除教练「${coach.name}」吗？此操作不可撤销。`,
                      )
                    )
                      deleteMutation.mutate(coach.id)
                  }}
                >
                  删除
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">暂无教练，点击"添加教练"开始</p>
      )}
    </div>
  )
}
