import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'
import { AUTH, SITE } from '@/lib/constants/locale'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams
  const registered = params.registered === 'true'

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">{AUTH.loginTitle}</h1>
          <p className="text-sm text-muted-foreground">{SITE.teamName}</p>
        </div>

        {registered && (
          <div className="rounded-md border border-green-200 bg-green-50 p-3">
            <p className="text-sm text-green-800">{AUTH.registerSuccess}</p>
          </div>
        )}

        <LoginForm />

        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/register"
            className="underline underline-offset-4 hover:text-primary"
          >
            {AUTH.registerLink}
          </Link>
        </p>
      </div>
    </div>
  )
}
