import {
  Briefcase,
  ExternalLink,
  Home,
  Shield,
  Swords,
  Trophy,
  Users,
} from "lucide-react"

import { SidebarAppearance } from "@/components/Common/Appearance"
import { Logo } from "@/components/Common/Logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import useAuth from "@/hooks/useAuth"
import { type Item, Main } from "./Main"
import { User } from "./User"

const baseItems: Item[] = [
  { icon: Home, title: "仪表盘", path: "/dashboard" },
  { icon: Briefcase, title: "项目", path: "/items" },
]

const footballItems: Item[] = [
  { icon: Shield, title: "球队介绍", path: "/team-content" },
  { icon: Users, title: "教练管理", path: "/coaches" },
  { icon: Users, title: "球员管理", path: "/players" },
  { icon: Swords, title: "比赛管理", path: "/match-management" },
]

export function AppSidebar() {
  const { user: currentUser } = useAuth()

  const items = currentUser?.is_superuser
    ? [
        ...baseItems,
        ...footballItems,
        { icon: Trophy, title: "管理员", path: "/admin" },
      ]
    : baseItems

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-6 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
        <Logo variant="responsive" />
      </SidebarHeader>
      <SidebarContent>
        <Main items={items} />
        <div className="mt-auto px-3 py-2">
          <a
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ExternalLink className="size-4" />
            <span className="group-data-[collapsible=icon]:hidden">
              查看网站
            </span>
          </a>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <SidebarAppearance />
        <User user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
