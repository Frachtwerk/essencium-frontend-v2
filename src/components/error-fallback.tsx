import { useRouter } from '@tanstack/react-router'
import type { FallbackProps } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

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
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">{t('error.title')}</h1>
      <p className="text-muted-foreground max-w-md text-center">
        {getErrorMessage(error) ?? t('error.unknown')}
      </p>
      <Button onClick={resetErrorBoundary}>{t('error.retry')}</Button>
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

export function RouteError({
  error,
}: Readonly<{ error: unknown }>): React.ReactElement {
  const { t } = useTranslation()
  const router = useRouter()
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">{t('error.title')}</h1>
      <p className="text-muted-foreground max-w-md text-center">
        {getErrorMessage(error) ?? t('error.unknown')}
      </p>
      <Button onClick={() => void router.invalidate()}>
        {t('error.retry')}
      </Button>
    </div>
  )
}
