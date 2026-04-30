import { useRouter } from '@tanstack/react-router'
import type { FallbackProps } from 'react-error-boundary'

import { Button } from '@/components/ui/button'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Ein unbekannter Fehler ist aufgetreten'
}

export function FullPageError({
  error,
  resetErrorBoundary,
}: FallbackProps): React.ReactElement {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Es ist ein Fehler aufgetreten</h1>
      <p className="text-muted-foreground max-w-md text-center">
        {getErrorMessage(error)}
      </p>
      <Button onClick={resetErrorBoundary}>Nochmal versuchen</Button>
    </div>
  )
}

export function ContentError({
  error,
  resetErrorBoundary,
}: FallbackProps): React.ReactElement {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-12">
      <h2 className="text-lg font-semibold">Es ist ein Fehler aufgetreten</h2>
      <p className="text-muted-foreground text-sm">{getErrorMessage(error)}</p>
      <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
        Nochmal versuchen
      </Button>
    </div>
  )
}

export function RouteError({
  error,
}: Readonly<{ error: unknown }>): React.ReactElement {
  const router = useRouter()
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Es ist ein Fehler aufgetreten</h1>
      <p className="text-muted-foreground max-w-md text-center">
        {getErrorMessage(error)}
      </p>
      <Button onClick={() => void router.invalidate()}>
        Nochmal versuchen
      </Button>
    </div>
  )
}
