export interface VideoEmbed {
  embedUrl: string
  providerLabel: string
}

const BILIBILI_BVID_RE = /^BV[a-zA-Z0-9]+$/
const BILIBILI_AVID_RE = /^av(\d+)$/i
const YOUKU_ID_RE = /^id_([^/.]+)(?:\.html)?$/
const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/
const VIMEO_ID_RE = /^\d+$/

export function getVideoEmbed(
  url: string | null | undefined,
): VideoEmbed | null {
  if (!url) return null

  let parsed: URL
  try {
    parsed = new URL(url.trim())
  } catch {
    return null
  }

  if (!["http:", "https:"].includes(parsed.protocol)) return null

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "")

  if (hostname === "bilibili.com" || hostname.endsWith(".bilibili.com")) {
    return getBilibiliEmbed(parsed)
  }

  if (hostname === "youku.com" || hostname.endsWith(".youku.com")) {
    return getYoukuEmbed(parsed)
  }

  if (
    hostname === "youtu.be" ||
    hostname === "youtube.com" ||
    hostname.endsWith(".youtube.com")
  ) {
    return getYouTubeEmbed(parsed, hostname)
  }

  if (hostname === "vimeo.com" || hostname.endsWith(".vimeo.com")) {
    return getVimeoEmbed(parsed)
  }

  return null
}

function getBilibiliEmbed(url: URL): VideoEmbed | null {
  const videoId = getPathSegment(url, "video")
  if (!videoId) return null

  const params = new URLSearchParams({
    autoplay: "0",
    high_quality: "1",
    page: url.searchParams.get("p") ?? "1",
  })

  const avidMatch = videoId.match(BILIBILI_AVID_RE)
  if (BILIBILI_BVID_RE.test(videoId)) {
    params.set("bvid", videoId)
  } else if (avidMatch) {
    params.set("aid", avidMatch[1])
  } else {
    return null
  }

  return {
    embedUrl: `https://player.bilibili.com/player.html?${params.toString()}`,
    providerLabel: "Bilibili",
  }
}

function getYoukuEmbed(url: URL): VideoEmbed | null {
  const embedId = getPathSegment(url, "embed")
  const showSegment = url.pathname
    .split("/")
    .filter(Boolean)
    .find((segment) => YOUKU_ID_RE.test(segment))
  const showId = showSegment?.match(YOUKU_ID_RE)?.[1]
  const videoId = embedId || showId

  if (!videoId) return null

  return {
    embedUrl: `https://player.youku.com/embed/${encodeURIComponent(videoId)}`,
    providerLabel: "优酷",
  }
}

function getYouTubeEmbed(url: URL, hostname: string): VideoEmbed | null {
  const videoId =
    hostname === "youtu.be"
      ? url.pathname.split("/").filter(Boolean)[0]
      : url.searchParams.get("v") ||
        getPathSegment(url, "embed") ||
        getPathSegment(url, "shorts")

  if (!videoId || !YOUTUBE_ID_RE.test(videoId)) return null

  return {
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    providerLabel: "YouTube",
  }
}

function getVimeoEmbed(url: URL): VideoEmbed | null {
  const videoId =
    getPathSegment(url, "video") || url.pathname.split("/").filter(Boolean)[0]

  if (!videoId || !VIMEO_ID_RE.test(videoId)) return null

  return {
    embedUrl: `https://player.vimeo.com/video/${videoId}`,
    providerLabel: "Vimeo",
  }
}

function getPathSegment(url: URL, marker: string): string | null {
  const segments = url.pathname.split("/").filter(Boolean)
  const markerIndex = segments.findIndex(
    (segment) => segment.toLowerCase() === marker,
  )

  return markerIndex >= 0 ? (segments[markerIndex + 1] ?? null) : null
}
