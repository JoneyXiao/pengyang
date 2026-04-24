import type { MatchMediaPublic } from "@/client"

interface MediaGalleryProps {
  media: MatchMediaPublic[]
}

export function MediaGallery({ media }: MediaGalleryProps) {
  const photos = media.filter((m) => m.media_type === "photo")
  const videos = media.filter((m) => m.media_type === "video")

  if (media.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[#E5E5E5] px-4 py-8 text-center">
        <p className="font-body text-sm text-[#707072]">暂无媒体</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Photo Grid */}
      {photos.length > 0 && (
        <div>
          <h4 className="mb-3 font-display text-xs uppercase tracking-[0.1em] text-[#707072]">
            照片
          </h4>
          <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <a
                key={photo.id}
                href={photo.file_path ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden"
              >
                <img
                  src={photo.file_path ?? ""}
                  alt={photo.caption || "比赛照片"}
                  className="aspect-square w-full object-cover grayscale transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
                  loading="lazy"
                />
                {photo.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="truncate font-body text-xs text-white">
                      {photo.caption}
                    </p>
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Video Links */}
      {videos.length > 0 && (
        <div>
          <h4 className="mb-3 font-display text-xs uppercase tracking-[0.1em] text-[#707072]">
            视频
          </h4>
          <div className="space-y-2">
            {videos.map((video) => (
              <a
                key={video.id}
                href={video.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-[#E5E5E5] p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
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
                  <p className="truncate font-body text-sm font-medium">
                    {video.title || "观看视频"}
                  </p>
                  {video.caption && (
                    <p className="truncate font-body text-xs text-[#707072]">
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
