import { Link } from "@tanstack/react-router"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

const footerLinks = [
  { to: "/team", label: "球队介绍" },
  { to: "/roster", label: "教练与球员" },
  { to: "/matches", label: "比赛" },
] as const

export function Footer() {
  return (
    <footer className="border-t-4 border-[#FA5400] bg-[#111111] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <p
          className="mb-6 text-center font-display text-xl tracking-tight md:text-2xl"
          style={{ fontWeight: 700 }}
        >
          深圳市龙华区观湖实验学校 - 鹏飏
        </p>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {footerLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-body text-sm text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mb-8 flex justify-center">
          <ThemeSlider />
        </div>

        <p className="text-center font-body text-xs text-white/50">
          © {new Date().getFullYear()} 深圳市龙华区观湖实验学校 - 鹏飏. All
          Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

function ThemeSlider() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "切换到浅色模式" : "切换到深色模式"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-3 py-2 font-body text-xs font-medium text-white/70 transition-colors hover:border-white/30 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
    >
      <Sun className="size-4 text-white/60 transition-colors group-aria-checked:text-white/35" />
      <span className="relative h-7 w-14 rounded-full bg-white/15 p-1 transition-colors group-aria-checked:bg-[#FA5400]">
        <span
          className={`block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
            isDark ? "translate-x-7" : "translate-x-0"
          }`}
        />
      </span>
      <Moon className="size-4 text-white/35 transition-colors group-aria-checked:text-white" />
      <span className="sr-only">{isDark ? "深色模式" : "浅色模式"}</span>
    </button>
  )
}
