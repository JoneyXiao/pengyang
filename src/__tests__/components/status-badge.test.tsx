import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '@/components/ui/status-badge'

describe('StatusBadge', () => {
  it('renders upcoming status with correct label', () => {
    render(<StatusBadge status="upcoming" />)
    expect(screen.getByText('即将开始')).toBeInTheDocument()
  })

  it('renders live status with correct label', () => {
    render(<StatusBadge status="live" />)
    expect(screen.getByText('进行中')).toBeInTheDocument()
  })

  it('renders completed status with correct label', () => {
    render(<StatusBadge status="completed" />)
    expect(screen.getByText('已完成')).toBeInTheDocument()
  })

  it('renders cancelled status with correct label', () => {
    render(<StatusBadge status="cancelled" />)
    expect(screen.getByText('已取消')).toBeInTheDocument()
  })

  it('renders pulsing dot for live status', () => {
    const { container } = render(<StatusBadge status="live" />)
    const pulsingDot = container.querySelector('.animate-ping')
    expect(pulsingDot).toBeInTheDocument()
  })

  it('does not render pulsing dot for non-live statuses', () => {
    const { container } = render(<StatusBadge status="upcoming" />)
    const pulsingDot = container.querySelector('.animate-ping')
    expect(pulsingDot).not.toBeInTheDocument()
  })

  it('applies sky-blue styling for upcoming', () => {
    const { container } = render(<StatusBadge status="upcoming" />)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('bg-sky-100')
  })

  it('applies red styling for live', () => {
    const { container } = render(<StatusBadge status="live" />)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('bg-red-100')
  })

  it('applies green styling for completed', () => {
    const { container } = render(<StatusBadge status="completed" />)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('bg-green-100')
  })

  it('applies zinc styling for cancelled', () => {
    const { container } = render(<StatusBadge status="cancelled" />)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('bg-zinc-100')
  })
})
