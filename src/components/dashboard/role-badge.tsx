import { ROLES } from '@/lib/constants/locale'
import type { UserRole } from '@/lib/types'

const roleStyles: Record<UserRole, string> = {
  regular: 'bg-muted text-muted-foreground',
  admin: 'bg-blue-100 text-blue-800',
  super_admin: 'bg-purple-100 text-purple-800',
}

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleStyles[role]}`}
    >
      {ROLES[role]}
    </span>
  )
}
