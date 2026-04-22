import { describe, it, expect } from 'vitest'
import {
  registerSchema,
  loginSchema,
  profileSchema,
} from '@/lib/validations/auth'

describe('registerSchema', () => {
  it('accepts valid input', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      username: 'test_user',
      password: '12345678',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({
      email: 'not-an-email',
      username: 'test_user',
      password: '12345678',
    })
    expect(result.success).toBe(false)
  })

  it('rejects short username', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      username: 'a',
      password: '12345678',
    })
    expect(result.success).toBe(false)
  })

  it('rejects username with special characters', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      username: 'user name!',
      password: '12345678',
    })
    expect(result.success).toBe(false)
  })

  it('rejects username over 30 characters', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      username: 'a'.repeat(31),
      password: '12345678',
    })
    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      username: 'test_user',
      password: '1234567',
    })
    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('accepts valid input', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'bad',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('profileSchema', () => {
  it('accepts valid input', () => {
    const result = profileSchema.safeParse({
      username: 'new_name',
      display_name: '显示名称',
    })
    expect(result.success).toBe(true)
  })

  it('accepts optional fields', () => {
    const result = profileSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('accepts null display_name', () => {
    const result = profileSchema.safeParse({
      display_name: null,
    })
    expect(result.success).toBe(true)
  })

  it('rejects display_name over 50 characters', () => {
    const result = profileSchema.safeParse({
      display_name: 'a'.repeat(51),
    })
    expect(result.success).toBe(false)
  })

  it('rejects short username', () => {
    const result = profileSchema.safeParse({
      username: 'a',
    })
    expect(result.success).toBe(false)
  })

  it('rejects username with invalid characters', () => {
    const result = profileSchema.safeParse({
      username: 'user name!',
    })
    expect(result.success).toBe(false)
  })
})
