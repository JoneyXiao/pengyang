import { Link, useLocation } from "@tanstack/react-router"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { isLoggedIn } from "@/hooks/useAuth"

const navLinks = [
  { to: "/", label: "首页" },
  { to: "/team", label: "球队介绍" },
  { to: "/roster", label: "教练与球员" },
  { to: "/matches", label: "比赛日程" },
] as const

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const loggedIn = isLoggedIn()

  return (
    <nav className="sticky top-0 z-50 bg-[#111111] text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "Jost, sans-serif", fontWeight: 900 }}
          >
            鹏飏足球
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-white ${
                location.pathname === link.to
                  ? "text-white underline underline-offset-4 decoration-2"
                  : "text-white/80"
              }`}
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to={loggedIn ? "/dashboard" : "/login"}
            className="rounded bg-[#FA5400] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#e04d00]"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
          >
            {loggedIn ? "进入管理" : "登录"}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 px-4 pb-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block py-3 text-sm font-medium ${
                location.pathname === link.to
                  ? "text-white font-semibold"
                  : "text-white/80"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to={loggedIn ? "/dashboard" : "/login"}
            className="mt-2 block rounded bg-[#FA5400] px-4 py-2 text-center text-sm font-medium text-white"
            onClick={() => setMobileOpen(false)}
          >
            {loggedIn ? "进入管理" : "登录"}
          </Link>
        </div>
      )}
    </nav>
  )
}
