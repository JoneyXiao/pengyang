import type { MatchMediaPublic } from "@/client"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getVideoEmbed } from "@/lib/videoEmbed"

interface MediaGalleryProps {
  media: MatchMediaPublic[]
}

export function MediaGallery({ media }: MediaGalleryProps) {
  const photos = media.filter((m) => m.media_type === "photo")
  const videos = media.filter((m) => m.media_type === "video")

  if (media.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center">
        <p className="font-body text-sm text-muted-foreground">暂无媒体</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Photo Grid */}
      {photos.length > 0 && (
        <div>
          <h4 className="mb-3 font-display text-xs uppercase tracking-[0.1em] text-muted-foreground">
            照片
          </h4>
          <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <Dialog key={photo.id}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="group relative w-full cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <img
                      src={photo.file_path ?? ""}
                      alt={photo.caption || "比赛照片"}
                      className="aspect-square w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    {photo.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <p className="truncate font-body text-xs text-white">
                          {photo.caption}
                        </p>
                      </div>
                    )}
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-[calc(100vw-2rem)] border-0 bg-transparent p-0 shadow-none sm:max-w-5xl">
                  <DialogTitle className="sr-only">
                    {photo.caption || "比赛照片"}
                  </DialogTitle>
                  <img
                    src={photo.file_path ?? ""}
                    alt={photo.caption || "比赛照片"}
                    className="max-h-[85vh] w-full object-contain"
                  />
                  {photo.caption && (
                    <p className="px-2 pb-1 text-center font-body text-sm text-white">
                      {photo.caption}
                    </p>
                  )}
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <div>
          <h4 className="mb-3 font-display text-xs uppercase tracking-[0.1em] text-muted-foreground">
            视频
          </h4>
          <div className="flex flex-col gap-2">
            {videos.map((video) => {
              const embed = getVideoEmbed(video.url)
              const title = video.title || "观看视频"
              const sourceUrl = video.url?.trim()
              const canOpenSource =
                sourceUrl !== undefined && /^https?:\/\//i.test(sourceUrl)

              if (!embed) {
                return (
                  <div
                    key={video.id}
                    className="flex min-h-16 items-center gap-3 rounded-lg border border-border bg-card p-3"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <svg
                        className="size-5 text-muted-foreground"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-body text-sm font-medium">
                        {title}
                      </p>
                      <p className="font-body text-xs text-muted-foreground">
                        此视频平台暂不支持内嵌播放
                      </p>
                    </div>
                    {canOpenSource ? (
                      <a
                        href={sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-11 shrink-0 items-center rounded-[30px] border border-primary px-3 py-2 font-display text-xs tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        aria-label={`在新页面打开视频：${title}`}
                        style={{ fontWeight: 700 }}
                      >
                        打开原链接
                      </a>
                    ) : (
                      <span className="shrink-0 font-body text-xs text-muted-foreground">
                        链接不可用
                      </span>
                    )}
                  </div>
                )
              }

              return (
                <Dialog key={video.id}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="group flex min-h-16 w-full cursor-pointer items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      aria-label={`播放视频：${title}`}
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors group-hover:bg-primary/90">
                        <svg
                          className="size-5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-body text-sm font-medium">
                          {title}
                        </p>
                        <p className="truncate font-body text-xs text-muted-foreground">
                          {video.caption || `${embed.providerLabel} 内嵌播放`}
                        </p>
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[calc(100vw-2rem)] gap-3 border-border bg-card p-3 shadow-lg sm:max-w-5xl sm:p-4">
                    <DialogTitle
                      className="pr-10 font-display text-base tracking-wide"
                      style={{ fontWeight: 700 }}
                    >
                      {title}
                    </DialogTitle>
                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
                      <iframe
                        src={embed.embedUrl}
                        title={`${title} 视频播放器`}
                        className="size-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                        sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
                      />
                    </div>
                    {video.caption && (
                      <p className="font-body text-sm text-muted-foreground">
                        {video.caption}
                      </p>
                    )}
                  </DialogContent>
                </Dialog>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
