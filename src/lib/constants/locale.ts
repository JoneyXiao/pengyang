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

// Auth & User Management

export const AUTH = {
  login: '登录',
  register: '注册',
  logout: '退出登录',
  email: '邮箱',
  username: '用户名',
  password: '密码',
  displayName: '显示名称',
  loginTitle: '登录账号',
  registerTitle: '注册账号',
  loginSubmit: '登录',
  registerSubmit: '注册',
  loginLink: '已有账号？去登录',
  registerLink: '没有账号？去注册',
  loginError: '邮箱或密码错误',
  registerSuccess: '注册成功，请登录',
  sessionExpired: '登录已过期，请重新登录',
  loggingIn: '登录中...',
  registering: '注册中...',
} as const

export const DASHBOARD = {
  title: '控制面板',
  greeting: '欢迎回来',
  requestAdmin: '申请管理员',
  requestPending: '申请审核中',
  requestApproved: '申请已通过',
  requestRejected: '申请未通过',
  reRequest: '重新申请',
  submittedAt: '提交时间',
  resolvedAt: '处理时间',
  requestAlreadyPending: '您已有一个待审核的申请',
  submitFailed: '提交失败，请重试',
} as const

export const PROFILE = {
  title: '个人资料',
  save: '保存',
  saving: '保存中...',
  saveSuccess: '个人资料已更新',
  saveFailed: '保存失败',
  avatar: '头像',
} as const

export const ADMIN = {
  requestsTitle: '管理员申请',
  usersTitle: '用户管理',
  contentTitle: '内容管理',
  contentComingSoon: '功能开发中…',
  approve: '批准',
  reject: '拒绝',
  demote: '降级为普通用户',
  noRequests: '暂无待处理的申请',
  confirmDemote: '确定要将此用户降级为普通用户吗？',
  invalidRequest: '无效的请求参数',
  invalidUserId: '无效的用户ID',
  operationFailed: '操作失败，请重试',
} as const

export const ROLES: Record<string, string> = {
  regular: '普通用户',
  admin: '管理员',
  super_admin: '超级管理员',
} as const
