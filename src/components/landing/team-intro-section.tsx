import Image from 'next/image'
import Link from 'next/link'
import type { TeamProfile } from '@/lib/types'
import { SECTIONS } from '@/lib/constants/locale'

interface TeamIntroSectionProps {
  profile: TeamProfile
}

export function TeamIntroSection({ profile }: TeamIntroSectionProps) {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <h2 className="text-[28px] font-bold leading-[1.25] tracking-tight">
            {SECTIONS.teamIntroTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {profile.description}
          </p>
          <Link
            href="/team"
            className="mt-6 inline-flex text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {SECTIONS.learnMore} →
          </Link>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          {profile.teamPhotoUrl ? (
            <Image
              src={profile.teamPhotoUrl}
              alt={profile.teamPhotoAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1023px) 100vw, 50vw"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-muted">
              <span className="text-4xl">⚽</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
