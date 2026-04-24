import type { LucideIcon } from "lucide-react"
import { Shield, UserCog, Users } from "lucide-react"
import type { IconType } from "react-icons"
import { IoIosFootball } from "react-icons/io"

export type NavItem = {
  icon: LucideIcon | IconType
  title: string
  path: string
}

export const adminNavItems: NavItem[] = [
  { icon: IoIosFootball, title: "比赛管理", path: "/dashboard" },
  { icon: Shield, title: "球队介绍", path: "/team-content" },
  { icon: UserCog, title: "教练管理", path: "/coaches" },
  { icon: Users, title: "球员管理", path: "/players" },
]
