import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  username: z
    .string()
    .min(2, '用户名至少需要2个字符')
    .max(30, '用户名不能超过30个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名仅支持字母、数字和下划线'),
  password: z.string().min(8, '密码至少需要8个字符'),
})

export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
})

export const profileSchema = z.object({
  username: z
    .string()
    .min(2, '用户名至少需要2个字符')
    .max(30, '用户名不能超过30个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名仅支持字母、数字和下划线')
    .optional(),
  display_name: z
    .string()
    .max(50, '显示名称不能超过50个字符')
    .nullable()
    .optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ProfileInput = z.infer<typeof profileSchema>
