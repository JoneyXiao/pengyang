import { getAllProfiles } from '@/lib/data/profiles'
import { UserList } from '@/components/dashboard/user-list'
import { ADMIN } from '@/lib/constants/locale'

export default async function AdminUsersPage() {
  const profiles = await getAllProfiles()

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">{ADMIN.usersTitle}</h1>
      <div className="mt-6">
        <UserList profiles={profiles} />
      </div>
    </div>
  )
}
