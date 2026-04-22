import { ADMIN } from '@/lib/constants/locale'

export default function AdminContentPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">{ADMIN.contentTitle}</h1>
      <p className="mt-4 text-muted-foreground">{ADMIN.contentComingSoon}</p>
    </div>
  )
}
