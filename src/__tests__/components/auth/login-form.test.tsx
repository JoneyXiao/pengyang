import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoginForm } from '@/components/auth/login-form'

vi.mock('@/app/(auth)/login/actions', () => ({
  loginUser: vi.fn(),
}))

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/邮箱/)).toBeInTheDocument()
    expect(screen.getByLabelText(/密码/)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<LoginForm />)

    expect(screen.getByRole('button', { name: /登录/ })).toBeInTheDocument()
  })

  it('email field has correct type', () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/邮箱/)
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('password field has correct type', () => {
    render(<LoginForm />)

    const passwordInput = screen.getByLabelText(/密码/)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})
