import { Link, useLocation } from "@tanstack/react-router"
import { ChevronDown, Menu, User, X } from "lucide-react"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { adminNavItems } from "@/config/nav"
import { isLoggedIn } from "@/hooks/useAuth"

const navLinks = [
  { to: "/", label: "首页" },
  { to: "/team", label: "球队介绍" },
  { to: "/roster", label: "阵容" },
  { to: "/matches", label: "比赛" },
] as const

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const loggedIn = isLoggedIn()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to)

  return (
    <>
      <nav
        className={`sticky top-0 z-50 border-b-2 border-primary bg-background/95 backdrop-blur-md transition-shadow duration-200 ${
          scrolled ? "shadow-[0_2px_4px_rgba(0,0,0,0.05)]" : ""
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span
              className="font-display text-lg italic tracking-tight text-foreground"
              style={{ fontWeight: 900 }}
            >
              深圳市龙华区观湖实验学校 - 鹏飏
            </span>
          </Link>

          {/* Desktop nav links - centered */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative py-1 font-body text-sm tracking-wide transition-colors ${
                  isActive(link.to)
                    ? "font-semibold text-foreground"
                    : "font-medium text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute -bottom-[19px] left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden items-center gap-3 md:flex">
            {loggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-foreground transition-colors hover:bg-muted"
                    aria-label="管理菜单"
                  >
                    <User size={18} />
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  {adminNavItems.map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link to={item.path} className="flex items-center gap-2">
                        <item.icon size={14} />
                        {item.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/login"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
                aria-label="登录"
              >
                <User size={18} />
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center text-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay — outside <nav> so backdrop-blur doesn't trap it */}
      <div
        className={`fixed inset-0 top-[66px] z-[60] bg-background transition-all duration-200 ease-out md:hidden ${
          mobileOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="flex h-full flex-col px-6 pt-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`border-b border-border py-4 font-display text-2xl uppercase tracking-tight ${
                isActive(link.to)
                  ? "font-bold text-foreground"
                  : "font-bold text-muted-foreground"
              }`}
              style={{ fontWeight: 900 }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {loggedIn ? (
            <div className="mt-6 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                管理后台
              </p>
              {adminNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon size={16} className="text-muted-foreground" />
                  {item.title}
                </Link>
              ))}
            </div>
          ) : (
            <Link
              to="/login"
              className="mt-8 flex h-12 items-center justify-center rounded-[30px] bg-primary font-body text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              onClick={() => setMobileOpen(false)}
            >
              登录
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
