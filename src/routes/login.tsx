import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { Suspense, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { RouteError } from '@/components/error-fallback'
import { ContentSpinner, FullPageSpinner } from '@/components/spinner'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/auth-context'
import { getRegistrationsOptions } from '@/generated/client/@tanstack/react-query.gen'
import {
  API_BASE_URL,
  baseClient,
  getAccessToken,
  setAccessToken,
  waitForAuth,
} from '@/lib/auth-store'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    await waitForAuth()
    if (getAccessToken()) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/' })
    }
  },
  validateSearch: z.object({
    token: z.string().optional(),
    redirect: z.string().optional(),
  }),
  component: LoginPage,
  pendingComponent: FullPageSpinner,
  errorComponent: RouteError,
})

type SsoProvider = { imageUrl: string; name: string; url: string }

function SsoSection(): React.ReactElement | null {
  const { t } = useTranslation()
  const { data: ssoProviders } = useSuspenseQuery(
    getRegistrationsOptions({ client: baseClient }),
  )
  const appUrl = import.meta.env.VITE_APP_URL ?? window.location.origin
  const ssoEntries = Object.entries(
    (ssoProviders as Record<string, SsoProvider> | undefined) ?? {},
  )

  if (ssoEntries.length === 0) return null

  return (
    <>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="border-border w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card text-muted-foreground px-2">
            {t('auth.ssoLogin')}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        {ssoEntries.map(([key, provider]) => (
          <a
            key={key}
            href={`${API_BASE_URL}${provider.url}?redirect_uri=${encodeURIComponent(`${appUrl}/login`)}`}
            className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
          >
            {provider.name}
          </a>
        ))}
      </div>
    </>
  )
}

function LoginPage(): React.ReactElement {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const { token: oauthToken, redirect: redirectTo } = Route.useSearch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Handle OAuth token returned from backend redirect
  useEffect(() => {
    if (!oauthToken) return
    setAccessToken(oauthToken)
    void navigate({ to: redirectTo ?? '/' })
  }, [oauthToken, redirectTo, navigate])

  const loginMutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: () => void navigate({ to: '/' }),
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    loginMutation.mutate()
  }

  const errorMessage = loginMutation.error
    ? loginMutation.error instanceof Error
      ? loginMutation.error.message
      : t('auth.loginFailed')
    : null

  // Show spinner while processing OAuth callback token
  if (oauthToken) {
    return (
      <div className="bg-background flex min-h-svh items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <ContentSpinner />
          <p className="text-muted-foreground text-sm">
            {t('auth.ssoLoading')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <img
            src="/img/logo.svg"
            alt={t('common.appName')}
            className="mb-2 h-9 dark:hidden"
          />
          <img
            src="/img/logo-white.svg"
            alt={t('common.appName')}
            className="mb-2 hidden h-9 dark:block"
          />
          <CardTitle className="text-xl">{t('auth.login')}</CardTitle>
          <CardDescription>{t('auth.loginSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="bg-destructive text-destructive-foreground rounded-md p-3 text-sm">
                {errorMessage}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending
                ? t('auth.loginPending')
                : t('auth.login')}
            </Button>
            <div className="text-center">
              <Link
                to="/reset-password"
                className="text-muted-foreground text-sm hover:underline"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>
          </form>
          <Suspense fallback={null}>
            <SsoSection />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
