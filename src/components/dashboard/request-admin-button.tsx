'use client'

import { useActionState } from 'react'
import { submitAdminRequestAction } from '@/app/(protected)/dashboard/actions'
import { Button } from '@/components/ui/button'

export function RequestAdminButton({ label }: { label: string }) {
  const [state, formAction, isPending] = useActionState(
    submitAdminRequestAction,
    null
  )

  return (
    <form action={formAction}>
      {state?.error && (
        <p className="mb-2 text-sm text-destructive">{state.error}</p>
      )}
      <Button variant="outline" disabled={isPending}>
        {label}
      </Button>
    </form>
  )
}
