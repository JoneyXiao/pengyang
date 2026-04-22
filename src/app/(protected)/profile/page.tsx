import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/data/profiles'
import { ProfileForm } from '@/components/profile/profile-form'
import { PROFILE } from '@/lib/constants/locale'

export default async function ProfilePage() {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect('/login')
  }

  return (
    <div className="mx-auto max-w-[600px] px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">{PROFILE.title}</h1>
      <div className="mt-6">
        <ProfileForm profile={profile} />
      </div>
    </div>
  )
}
