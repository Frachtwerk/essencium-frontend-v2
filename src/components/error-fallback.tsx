import { useSearch } from '@tanstack/react-router'
import type { FallbackProps } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
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
  const { redirect: attemptedPath } = useSearch({
    from: '/_authenticated/forbidden',
  })
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-12">
      <h1 className="text-2xl font-bold">{t('error.title')}</h1>
      <p className="text-muted-foreground max-w-md text-center">
        {t('error.forbiddenError')}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <LinkButton to="/">{t('common.toDashboard')}</LinkButton>
        {attemptedPath !== undefined && (
          <LinkButton variant="outline" to={attemptedPath}>
            {t('error.retry')}
          </LinkButton>
        )}
      </div>
    </div>
  )
}
