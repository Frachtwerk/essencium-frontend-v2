import { useQueryClient } from '@tanstack/react-query'
import {
  type ErrorComponentProps,
  useRouter,
  useSearch,
} from '@tanstack/react-router'
import type { FallbackProps } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { meQueryKey } from '@/hooks/data/me'
import { getAccessToken } from '@/lib/auth-store'

function getErrorMessage(error: unknown): string | null {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return null
}

export function FullPageError({
  error,
  resetErrorBoundary,
}: FallbackProps): React.ReactElement {
  const { t } = useTranslation()
  const isAuthenticated = getAccessToken() !== null
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">{t('error.title')}</h1>
      <p className="text-muted-foreground max-w-md text-center">
        {getErrorMessage(error) ?? t('error.unknown')}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button onClick={resetErrorBoundary}>{t('error.retry')}</Button>
        {isAuthenticated && (
          <LinkButton variant="outline" to="/">
            {t('common.toDashboard')}
          </LinkButton>
        )}
      </div>
    </div>
  )
}

/**
 * Router-level error component. Retry must go through `router.invalidate()`:
 * the boundary's own `reset` only clears local state, while the match store
 * still holds `status: 'error'` and re-throws on the next render. Invalidating
 * re-runs `beforeLoad`/`loader` and bumps the boundary's reset key.
 */
export function RouteError({ error }: ErrorComponentProps): React.ReactElement {
  const router = useRouter()
  return (
    <FullPageError
      error={error}
      resetErrorBoundary={() => void router.invalidate()}
    />
  )
}

export function ContentError({
  error,
  resetErrorBoundary,
}: FallbackProps): React.ReactElement {
  const { t } = useTranslation()
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-12">
      <h2 className="text-lg font-semibold">{t('error.title')}</h2>
      <p className="text-muted-foreground text-sm">
        {getErrorMessage(error) ?? t('error.unknown')}
      </p>
      <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
        {t('error.retry')}
      </Button>
    </div>
  )
}

export function NotFoundError(): React.ReactElement {
  const { t } = useTranslation()
  const isAuthenticated = getAccessToken() !== null
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">{t('error.notFoundTitle')}</h1>
      <p className="text-muted-foreground max-w-md text-center">
        {t('error.notFoundError')}
      </p>
      <LinkButton to={isAuthenticated ? '/' : '/login'}>
        {isAuthenticated ? t('common.toDashboard') : t('auth.login')}
      </LinkButton>
    </div>
  )
}

export function ForbiddenError(): React.ReactElement {
  const { t } = useTranslation()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { redirect: attemptedPath } = useSearch({
    from: '/_authenticated/forbidden',
  })

  /**
   * Retrying is only meaningful if the guard re-reads the user's rights, but
   * `assertRights` goes through `ensureQueryData`, which resolves from cache
   * whenever data is present — regardless of staleness. Without invalidating
   * `/me` first, the guard would re-evaluate the same rights and redirect
   * straight back here.
   */
  async function recheckAccess(): Promise<void> {
    await queryClient.invalidateQueries({ queryKey: meQueryKey })
    if (attemptedPath !== undefined)
      await router.navigate({ to: attemptedPath })
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-12">
      <h1 className="text-2xl font-bold">{t('error.forbiddenTitle')}</h1>
      <p className="text-muted-foreground max-w-md text-center">
        {t('error.forbiddenError')}
      </p>
      <p className="text-muted-foreground max-w-md text-center text-sm">
        {t('error.forbiddenHint')}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <LinkButton to="/">{t('common.toDashboard')}</LinkButton>
        {attemptedPath !== undefined && (
          <Button variant="outline" onClick={() => void recheckAccess()}>
            {t('error.forbiddenRecheck')}
          </Button>
        )}
      </div>
    </div>
  )
}
