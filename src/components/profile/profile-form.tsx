'use client'

import { useActionState } from 'react'
import Image from 'next/image'
import { updateProfileAction } from '@/app/(protected)/profile/actions'
import { AUTH, PROFILE } from '@/lib/constants/locale'
import { Button } from '@/components/ui/button'
import type { Profile } from '@/lib/types'

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    null
  )

  return (
    <form action={formAction} className="space-y-6">
      {state?.success && (
        <div className="rounded-md border border-green-200 bg-green-50 p-3">
          <p className="text-sm text-green-800">{PROFILE.saveSuccess}</p>
        </div>
      )}

      {state?.error?.form && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{state.error.form[0]}</p>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Image
          src={profile.avatar_url}
          alt={PROFILE.avatar}
          width={64}
          height={64}
          className="rounded-full"
        />
        <div>
          <p className="font-medium">
            {profile.display_name || profile.username}
          </p>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          {AUTH.username}
        </label>
        <input
          id="username"
          name="username"
          type="text"
          defaultValue={profile.username}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {state?.error?.username && (
          <p className="text-sm text-destructive">{state.error.username[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="display_name" className="text-sm font-medium">
          {AUTH.displayName}
        </label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          defaultValue={profile.display_name ?? ''}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {state?.error?.display_name && (
          <p className="text-sm text-destructive">
            {state.error.display_name[0]}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? PROFILE.saving : PROFILE.save}
      </Button>
    </form>
  )
}
