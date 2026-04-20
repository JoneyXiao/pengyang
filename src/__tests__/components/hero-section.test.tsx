import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroSection } from '@/components/landing/hero-section'

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, ...props }: { children: React.ReactNode; href: string }) => {
    return <a {...props}>{children}</a>
  },
}))

describe('HeroSection', () => {
  it('renders team name', () => {
    render(
      <HeroSection
        teamName="鹏飏足球"
        tagline="友谊第一，比赛第二"
        imageUrl="/images/hero.jpg"
        imageAlt="Hero"
      />
    )
    expect(screen.getByText('鹏飏足球')).toBeInTheDocument()
  })

  it('renders tagline', () => {
    render(
      <HeroSection
        teamName="鹏飏足球"
        tagline="友谊第一，比赛第二"
        imageUrl="/images/hero.jpg"
        imageAlt="Hero"
      />
    )
    expect(screen.getByText('友谊第一，比赛第二')).toBeInTheDocument()
  })

  it('renders CTA button linking to schedule', () => {
    render(
      <HeroSection
        teamName="鹏飏足球"
        tagline="友谊第一，比赛第二"
        imageUrl="/images/hero.jpg"
        imageAlt="Hero"
      />
    )
    const cta = screen.getByText('查看赛程')
    expect(cta.closest('a')).toHaveAttribute('href', '/schedule')
  })

  it('renders hero image when imageUrl is provided', () => {
    render(
      <HeroSection
        teamName="鹏飏足球"
        tagline="友谊第一，比赛第二"
        imageUrl="/images/hero.jpg"
        imageAlt="Hero image"
      />
    )
    const img = screen.getByAltText('Hero image')
    expect(img).toBeInTheDocument()
  })

  it('renders green fallback when imageUrl is null', () => {
    const { container } = render(
      <HeroSection
        teamName="鹏飏足球"
        tagline="友谊第一，比赛第二"
        imageUrl={null}
        imageAlt="Hero"
      />
    )
    const fallback = container.querySelector('.bg-primary')
    expect(fallback).toBeInTheDocument()
    // Should not have an img tag
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
