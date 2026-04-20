import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SiteHeader } from '@/components/layout/site-header'
import type { NavItem } from '@/lib/types'

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

// Mock MobileNavSheet (client component)
vi.mock('@/components/layout/mobile-nav-sheet', () => ({
  MobileNavSheet: () => <div data-testid="mobile-nav-sheet" />,
}))

const navItems: NavItem[] = [
  { label: '赛程', href: '/schedule' },
  { label: '球队介绍', href: '/team' },
  { label: '相册', href: '/gallery' },
]

describe('SiteHeader', () => {
  it('renders team name wordmark', () => {
    render(<SiteHeader navItems={navItems} badgeUrl="/images/badge.png" />)
    expect(screen.getByText('鹏飏足球')).toBeInTheDocument()
  })

  it('renders team badge image', () => {
    render(<SiteHeader navItems={navItems} badgeUrl="/images/badge.png" />)
    const badge = screen.getByAltText('鹏飏足球队徽')
    expect(badge).toBeInTheDocument()
  })

  it('renders desktop navigation links', () => {
    render(<SiteHeader navItems={navItems} badgeUrl="/images/badge.png" />)
    const links = screen.getAllByRole('link')
    const labels = links.map((l) => l.textContent)
    expect(labels).toContain('赛程')
    expect(labels).toContain('球队介绍')
    expect(labels).toContain('相册')
  })

  it('renders nav links with correct hrefs', () => {
    render(<SiteHeader navItems={navItems} badgeUrl="/images/badge.png" />)
    const scheduleLink = screen.getByRole('link', { name: '赛程' })
    expect(scheduleLink).toHaveAttribute('href', '/schedule')
  })

  it('renders as a header landmark', () => {
    render(<SiteHeader navItems={navItems} badgeUrl="/images/badge.png" />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders mobile nav sheet trigger', () => {
    render(<SiteHeader navItems={navItems} badgeUrl="/images/badge.png" />)
    expect(screen.getByTestId('mobile-nav-sheet')).toBeInTheDocument()
  })
})
