import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRef, useState } from "react"
import { MatchMediaService, PublicService } from "@/client"
import useCustomToast from "@/hooks/useCustomToast"
import { isValidUrl, MAX_PHOTO_SIZE_BYTES } from "./shared"

export function MediaUploadCard({ matchId }: { matchId: string }) {
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
          className={`flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 ${
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

        <div className="space-y-3">
          {/* Video link form */}
          <div className="flex gap-2">
            <input
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="视频标题"
              className="w-28 rounded-lg border-2 border-[#E5E5E5] bg-white px-3 py-2 text-sm transition-colors focus:border-[#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-1"
            />
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="视频链接 (如Bilibili)"
              className={`flex-1 rounded-lg border-2 bg-white px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-1 ${
                videoUrl.trim() && !videoUrlValid
                  ? "border-red-300 focus:border-red-500"
                  : "border-[#E5E5E5] focus:border-[#111111]"
              }`}
            />
            <button
              type="button"
              disabled={!videoUrlValid}
              onClick={() => addVideoMutation.mutate()}
              className="shrink-0 rounded-[30px] bg-[#111111] px-4 py-2 font-display text-xs tracking-wide text-white transition-colors hover:bg-[#292929] disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
              style={{ fontWeight: 700 }}
            >
              添加
            </button>
          </div>
          {videoUrl.trim() && !videoUrlValid && (
            <p className="text-xs text-red-500">请输入有效的链接地址</p>
          )}

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
                    className="absolute right-0.5 top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1"
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
