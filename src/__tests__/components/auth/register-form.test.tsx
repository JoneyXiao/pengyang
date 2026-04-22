import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RegisterForm } from '@/components/auth/register-form'

vi.mock('@/app/(auth)/register/actions', () => ({
  registerUser: vi.fn(),
}))

describe('RegisterForm', () => {
  it('renders email, username, and password fields', () => {
    render(<RegisterForm />)

    expect(screen.getByLabelText(/邮箱/)).toBeInTheDocument()
    expect(screen.getByLabelText(/用户名/)).toBeInTheDocument()
    expect(screen.getByLabelText(/密码/)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<RegisterForm />)

    expect(screen.getByRole('button', { name: /注册/ })).toBeInTheDocument()
  })

  it('username field has correct autocomplete', () => {
    render(<RegisterForm />)

    const usernameInput = screen.getByLabelText(/用户名/)
    expect(usernameInput).toHaveAttribute('autocomplete', 'username')
  })

  it('password field has minlength', () => {
    render(<RegisterForm />)

    const passwordInput = screen.getByLabelText(/密码/)
    expect(passwordInput).toHaveAttribute('minlength', '8')
  })
})
