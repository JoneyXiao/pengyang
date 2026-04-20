import Link from 'next/link'
import Image from 'next/image'
import type { NavItem } from '@/lib/types'
import { SITE } from '@/lib/constants/locale'

interface SiteFooterProps {
  navItems: NavItem[]
  teamName: string
  badgeUrl: string
  contactAddress: string
  contactEmail: string
}

export function SiteFooter({
  navItems,
  teamName,
  badgeUrl,
  contactAddress,
  contactEmail,
}: SiteFooterProps) {
  return (
    <footer className="bg-zinc-900 text-zinc-400">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Team identity */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src={badgeUrl}
                alt={`${SITE.teamName}队徽`}
                width={40}
                height={40}
                className="size-10"
              />
              <div>
                <p className="text-sm font-bold text-white">{SITE.teamName}</p>
                <p className="text-xs text-zinc-500">{SITE.schoolName}</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed">{teamName}</p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-sm font-bold text-white">快速链接</p>
            <nav className="mt-3 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="min-h-[44px] flex items-center text-sm transition-colors hover:text-primary"
                  {...(item.isExternal
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact info */}
          <div>
            <p className="text-sm font-bold text-white">联系我们</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <p>{contactAddress}</p>
              <a
                href={`mailto:${contactEmail}`}
                className="transition-colors hover:text-primary"
              >
                {contactEmail}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-6 text-center text-xs">
          {SITE.copyright}
        </div>
      </div>
    </footer>
  )
}
