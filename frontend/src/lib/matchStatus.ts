import type { MatchStatus } from "@/client"

type MatchStatusConfig = {
  text: string
  cls: string
}

export const MATCH_STATUS_CONFIG = {
  upcoming: { text: "即将开始", cls: "bg-primary text-primary-foreground" },
  live: { text: "进行中", cls: "bg-secondary text-secondary-foreground" },
  completed: {
    text: "已结束",
    cls: "border border-border bg-muted text-muted-foreground",
  },
} satisfies Record<MatchStatus, MatchStatusConfig>

const MATCH_STATUS_KEYS = new Set<string>(Object.keys(MATCH_STATUS_CONFIG))

const UNKNOWN_MATCH_STATUS_CONFIG: MatchStatusConfig = {
  text: "未知状态",
  cls: "border border-border bg-muted text-muted-foreground",
}

export function getMatchStatusConfig(status: string): MatchStatusConfig {
  if (MATCH_STATUS_KEYS.has(status)) {
    return MATCH_STATUS_CONFIG[status as MatchStatus]
  }

  return UNKNOWN_MATCH_STATUS_CONFIG
}
