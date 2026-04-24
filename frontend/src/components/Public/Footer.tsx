import { Link } from "@tanstack/react-router"

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

        <p className="text-center font-body text-xs text-white/50">
          © {new Date().getFullYear()} 深圳市龙华区观湖实验学校 - 鹏飏. All
          Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
