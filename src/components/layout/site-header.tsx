import Link from 'next/link'
import Image from 'next/image'
import type { NavItem } from '@/lib/types'
import { SITE } from '@/lib/constants/locale'
import { MobileNavSheet } from '@/components/layout/mobile-nav-sheet'
import { UserNav } from '@/components/layout/user-nav'

interface SiteHeaderProps {
  navItems: NavItem[]
  badgeUrl: string
}

export function SiteHeader({ navItems, badgeUrl }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src={badgeUrl}
            alt={`${SITE.teamName}队徽`}
            width={32}
            height={32}
            className="size-8"
          />
          <span className="text-xl font-bold text-foreground">
            {SITE.teamName}
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              {...(item.isExternal
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {item.label}
            </Link>
          ))}
          <UserNav />
        </nav>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <UserNav />
          <MobileNavSheet navItems={navItems} />
        </div>
      </div>
    </header>
  )
}
