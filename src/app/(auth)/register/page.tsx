import Link from 'next/link'
import { RegisterForm } from '@/components/auth/register-form'
import { AUTH, SITE } from '@/lib/constants/locale'

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">{AUTH.registerTitle}</h1>
          <p className="text-sm text-muted-foreground">{SITE.teamName}</p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            {AUTH.loginLink}
          </Link>
        </p>
      </div>
    </div>
  )
}
