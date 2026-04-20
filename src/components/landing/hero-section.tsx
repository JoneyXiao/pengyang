import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HERO } from '@/lib/constants/locale'

interface HeroSectionProps {
  teamName: string
  tagline: string
  imageUrl: string | null
  imageAlt: string
}

export function HeroSection({
  teamName,
  tagline,
  imageUrl,
  imageAlt,
}: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[480px] items-end overflow-hidden rounded-b-[20px] md:min-h-[560px] lg:min-h-[640px]">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority
          className="object-cover object-[62%_28%] sm:object-[60%_30%] lg:object-[58%_32%]"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-primary" />
      )}

      {/* Keep the subject visible while preserving contrast under the copy. */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/52 via-black/16 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/42 via-transparent to-white/8" />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 pb-12 sm:px-6 md:pb-16 lg:px-8">
        <div className="max-w-[28rem] rounded-2xl bg-black/18 p-5 backdrop-blur-[2px] sm:p-6">
          <h1 className="text-[32px] font-black leading-[1.15] tracking-tight text-white md:text-[40px] lg:text-[48px]">
            {teamName}
          </h1>
          <p className="mt-2 text-base font-medium text-white/92 md:text-lg">
            {tagline}
          </p>
          <Button
            render={<Link href={HERO.ctaHref} />}
            nativeButton={false}
            size="lg"
            className="mt-6"
          >
            {HERO.ctaText}
          </Button>
        </div>
      </div>
    </section>
  )
}
