import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { ContentError, RouteError } from '@/components/error-fallback'
import { ContentSpinner, FullPageSpinner } from '@/components/spinner'
import { getAccessToken, waitForAuth } from '@/lib/auth-store'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    await waitForAuth()
    if (!getAccessToken()) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/login' })
    }
  },
  component: AuthenticatedLayout,
  pendingComponent: FullPageSpinner,
  errorComponent: RouteError,
})

function AuthenticatedLayout(): React.ReactElement {
  return (
    <ErrorBoundary FallbackComponent={ContentError}>
      <Suspense fallback={<ContentSpinner />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  )
}
