import { createRouter } from '@tanstack/react-router'

import { FullPageError, NotFoundError } from './components/error-fallback'
import { queryClient, type RouterContext } from './routes/__root'
import { routeTree } from './routeTree.gen'

import { FullPageSpinner } from '@/components/spinner'
import { initAuth } from '@/lib/auth-store'

import '@/lib/i18n'

// Kick off token refresh in the browser only — localStorage is not available on the server.
if (typeof window !== 'undefined') void initAuth()

const router = createRouter({
  routeTree,
  scrollRestoration: true,
  defaultPreload: 'intent',
  notFoundMode: 'root',
  defaultNotFoundComponent: NotFoundError,
  defaultErrorComponent: ({ error, reset }) => (
    <FullPageError error={error} resetErrorBoundary={reset} />
  ),
  defaultPendingComponent: FullPageSpinner,
  context: { queryClient } satisfies RouterContext,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function getRouter(): typeof router {
  return router
}
