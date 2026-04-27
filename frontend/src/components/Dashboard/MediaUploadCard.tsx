import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRef, useState } from "react"
import { MatchesService, MatchMediaService } from "@/client"
import useCustomToast from "@/hooks/useCustomToast"
import { isValidUrl, MAX_PHOTO_SIZE_BYTES } from "./shared"
import { MdOutlinePermMedia } from "react-icons/md"
import { ImUpload } from "react-icons/im"
import { IoVideocam } from "react-icons/io5"

export function MediaUploadCard({ matchId }: { matchId: string }) {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const [videoUrl, setVideoUrl] = useState("")
  const [videoTitle, setVideoTitle] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["match-detail", matchId],
    queryFn: () => MatchesService.getMatchDetail({ matchId }),
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
    const oversized = images.filter((f) => f.size > MAX_PHOTO_SIZE_BYTES)
    if (oversized.length > 0) {
      showErrorToast(`${oversized.length} 张照片超过 10MB 限制`)
    }
    const valid = images.filter((f) => f.size <= MAX_PHOTO_SIZE_BYTES)
    if (valid.length === 0) return
    const results = await Promise.allSettled(
      valid.map((file) => uploadPhotoMutation.mutateAsync(file)),
    )
    const failed = results.filter((r) => r.status === "rejected").length
    if (failed > 0) showErrorToast(`${failed} 张照片上传失败`)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const videoUrlValid = videoUrl.trim() !== "" && isValidUrl(videoUrl.trim())

  const mediaItems = data?.media ?? []

  return (
    <div className="rounded-lg border-1 border-border p-5 md:p-6">
      <div className="mb-5 flex items-center gap-2">
        <MdOutlinePermMedia className="size-5 text-foreground" />
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
          className={`flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
            isDragOver
              ? "border-secondary bg-secondary/10"
              : "border-border hover:border-ring hover:bg-muted/50"
          }`}
        >
          <ImUpload className="mb-2 size-10 text-muted-foreground" />
          <p
            className="font-display text-sm tracking-wide"
            style={{ fontWeight: 700 }}
          >
            拖拽文件至此
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
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

        <div className="space-y-3">
          {/* Video link form */}
          <div className="flex gap-2">
            <input
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="视频标题"
              className="w-28 rounded-lg border-1 border-input bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus:border-ring focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
            />
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="视频链接 (如Bilibili)"
              className={`flex-1 rounded-lg border-1 bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background ${
                videoUrl.trim() && !videoUrlValid
                  ? "border-destructive/50 focus:border-destructive"
                  : "border-input focus:border-ring"
              }`}
            />
            <button
              type="button"
              disabled={!videoUrlValid}
              onClick={() => addVideoMutation.mutate()}
              className="shrink-0 rounded-[30px] bg-primary px-4 py-2 font-display text-xs tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={{ fontWeight: 700 }}
            >
              添加
            </button>
          </div>
          {videoUrl.trim() && !videoUrlValid && (
            <p className="text-xs text-destructive">请输入有效的链接地址</p>
          )}

          {/* Media preview grid */}
          {isLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded bg-muted"
                />
              ))}
            </div>
          ) : mediaItems.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {mediaItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded bg-muted"
                >
                  {item.media_type === "photo" && item.file_path ? (
                    <img
                      src={item.file_path}
                      alt={item.caption || ""}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-2">
                      <IoVideocam className="mb-1 size-6 text-muted-foreground" />
                      <span className="truncate text-[10px] text-muted-foreground">
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
                    className="absolute right-0.5 top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-xs text-white opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                    aria-label="删除"
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="flex aspect-square items-center justify-center rounded border-2 border-dashed border-border">
                <span className="text-xs text-muted-foreground">空位</span>
              </div>
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded border-2 border-dashed border-border">
              <span className="text-xs text-muted-foreground">暂无媒体</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
