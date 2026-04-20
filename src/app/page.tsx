import { getUpcomingMatches, getRecentResults, getLiveMatches } from '@/lib/data/matches'
import { getTeamProfile } from '@/lib/data/team'
import { SECTIONS } from '@/lib/constants/locale'
import { HeroSection } from '@/components/landing/hero-section'
import { MatchesSection } from '@/components/landing/matches-section'
import { ResultsSection } from '@/components/landing/results-section'
import { TeamIntroSection } from '@/components/landing/team-intro-section'

export const revalidate = 60

export default async function HomePage() {
  const [upcomingMatches, recentResults, liveMatches, teamProfile] =
    await Promise.all([
      getUpcomingMatches(),
      getRecentResults(),
      getLiveMatches(),
      getTeamProfile(),
    ])

  // Merge live matches into the upcoming section for visibility
  const upcomingWithLive = [...liveMatches, ...upcomingMatches]

  return (
    <>
      <HeroSection
        teamName={teamProfile.name}
        tagline={teamProfile.tagline}
        imageUrl={teamProfile.heroImageUrl}
        imageAlt={teamProfile.heroImageAlt}
      />
      <MatchesSection
        matches={upcomingWithLive}
        title={SECTIONS.upcomingTitle}
      />
      <ResultsSection
        matches={recentResults}
        title={SECTIONS.resultsTitle}
      />
      <TeamIntroSection profile={teamProfile} />
    </>
  )
}
