import type { NavItem } from '@/lib/types'

export const SITE = {
  teamName: '鹏飏足球',
  schoolName: '深圳市龙华区观湖实验学校',
  teamFullName: '深圳市龙华区观湖实验学校鹏飏足球队',
  copyright: `© ${new Date().getFullYear()} 深圳市龙华区观湖实验学校鹏飏足球队`,
} as const

export const HERO = {
  ctaText: '查看赛程',
  ctaHref: '/schedule',
} as const

export const SECTIONS = {
  upcomingTitle: '近期赛事',
  resultsTitle: '最近战绩',
  teamIntroTitle: '关于我们',
  viewSchedule: '查看赛程',
  learnMore: '了解更多',
} as const

export const EMPTY_STATES = {
  noUpcoming: '暂无赛事安排',
  noResults: '暂无比赛结果',
} as const

export const STATUS_LABELS: Record<string, string> = {
  upcoming: '即将开始',
  live: '进行中',
  completed: '已完成',
  cancelled: '已取消',
} as const

export const NAV_ITEMS: NavItem[] = [
  { label: '赛程', href: '/schedule' },
  { label: '球队介绍', href: '/team' },
  { label: '相册', href: '/gallery' },
] as const
