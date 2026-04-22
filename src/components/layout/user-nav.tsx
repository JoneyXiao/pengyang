'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/components/auth/auth-provider'
import { logoutUser } from '@/app/(auth)/logout/actions'
import { AUTH, DASHBOARD, PROFILE, ADMIN, ROLES } from '@/lib/constants/locale'
import { Button } from '@/components/ui/button'

export function UserNav() {
  const { user, profile, isLoading } = useAuth()

  if (isLoading) return null

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="outline" size="sm">
          {AUTH.login}
        </Button>
      </Link>
    )
  }

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'
  const isSuperAdmin = profile?.role === 'super_admin'

  return (
    <div className="flex items-center gap-3">
      <div className="hidden items-center gap-2 sm:flex">
        <Image
          src={profile?.avatar_url ?? '/images/default-avatar.svg'}
          alt={profile?.username ?? ''}
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="text-sm">
          <p className="font-medium leading-none">
            {profile?.display_name || profile?.username}
          </p>
          <p className="text-xs text-muted-foreground">
            {ROLES[profile?.role ?? 'regular']}
          </p>
        </div>
      </div>

      <nav className="flex items-center gap-1">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            {DASHBOARD.title}
          </Button>
        </Link>
        <Link href="/profile">
          <Button variant="ghost" size="sm">
            {PROFILE.title}
          </Button>
        </Link>
        {isAdmin && (
          <Link href="/admin/content">
            <Button variant="ghost" size="sm">
              {ADMIN.contentTitle}
            </Button>
          </Link>
        )}
        {isSuperAdmin && (
          <>
            <Link href="/admin/requests">
              <Button variant="ghost" size="sm">
                {ADMIN.requestsTitle}
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm">
                {ADMIN.usersTitle}
              </Button>
            </Link>
          </>
        )}
        <form action={logoutUser}>
          <Button variant="ghost" size="sm">
            {AUTH.logout}
          </Button>
        </form>
      </nav>
    </div>
  )
}
