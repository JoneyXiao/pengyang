import type { MatchStatus } from "@/client"

export const BEIJING_TZ_OFFSET = "+08:00"

export function toBeijingDatetimeLocal(isoString: string): string {
  const parts = new Date(isoString).toLocaleString("sv-SE", {
    timeZone: "Asia/Shanghai",
  })
  return parts.replace(" ", "T").slice(0, 16)
}

export const STATUS_LABELS: Record<MatchStatus, string> = {
  upcoming: "即将开始",
  live: "进行中",
  completed: "已结束",
}

export const STATUS_COLORS: Record<MatchStatus, string> = {
  upcoming: "bg-primary text-primary-foreground",
  live: "bg-secondary text-secondary-foreground",
  completed: "border border-border bg-muted text-muted-foreground",
}

export const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024

export function isValidUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}
