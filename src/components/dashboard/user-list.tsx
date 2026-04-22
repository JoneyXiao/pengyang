'use client'

import { useActionState } from 'react'
import { demoteUserAction } from '@/app/(protected)/admin/users/actions'
import { ADMIN, ROLES } from '@/lib/constants/locale'
import { Button } from '@/components/ui/button'
import type { Profile } from '@/lib/types'

export function UserList({ profiles }: { profiles: Profile[] }) {
  return (
    <div className="space-y-3">
      {profiles.map((profile) => (
        <UserRow key={profile.id} profile={profile} />
      ))}
    </div>
  )
}

function UserRow({ profile }: { profile: Profile }) {
  const [, formAction, isPending] = useActionState(demoteUserAction, null)

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <p className="font-medium">
          {profile.display_name || profile.username}
        </p>
        <p className="text-sm text-muted-foreground">@{profile.username}</p>
        <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-xs">
          {ROLES[profile.role]}
        </span>
      </div>
      {profile.role === 'admin' && (
        <form action={formAction}>
          <input type="hidden" name="user_id" value={profile.id} />
          <Button size="sm" variant="outline" disabled={isPending}>
            {ADMIN.demote}
          </Button>
        </form>
      )}
    </div>
  )
}
