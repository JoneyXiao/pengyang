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
  upcoming: "bg-[#111111] text-white",
  live: "bg-[#FA5400] text-white",
  completed: "bg-[#F5F5F5] text-[#707072]",
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
