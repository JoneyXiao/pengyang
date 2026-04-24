import type { MatchMediaPublic } from "@/client"

interface MediaGalleryProps {
  media: MatchMediaPublic[]
}

export function MediaGallery({ media }: MediaGalleryProps) {
  const photos = media.filter((m) => m.media_type === "photo")
  const videos = media.filter((m) => m.media_type === "video")

  if (media.length === 0) {
    return (
      <p
        className="text-sm text-[#707072]"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        暂无媒体
      </p>
    )
  }

  return (
    <div className="space-y-8">
      {/* Photo Grid */}
      {photos.length > 0 && (
        <div>
          <h4
            className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#707072]"
            style={{ fontFamily: "Jost, sans-serif" }}
          >
            照片
          </h4>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <a
                key={photo.id}
                href={photo.file_path ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-lg"
              >
                <img
                  src={photo.file_path ?? ""}
                  alt={photo.caption || "比赛照片"}
                  className="aspect-square w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />
                {photo.caption && (
                  <p className="mt-1 truncate text-xs text-[#707072]">
                    {photo.caption}
                  </p>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Video Links */}
      {videos.length > 0 && (
        <div>
          <h4
            className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#707072]"
            style={{ fontFamily: "Jost, sans-serif" }}
          >
            视频
          </h4>
          <div className="space-y-3">
            {videos.map((video) => (
              <a
                key={video.id}
                href={video.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-[#E5E5E5] p-3 transition-colors hover:bg-[#F5F5F5]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FA5400]/10">
                  <svg
                    className="h-5 w-5 text-[#FA5400]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-sm">
                    {video.title || "观看视频"}
                  </p>
                  {video.caption && (
                    <p className="truncate text-xs text-[#707072]">
                      {video.caption}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
