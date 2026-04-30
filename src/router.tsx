import { createRouter } from '@tanstack/react-router'

import { queryClient, type RouterContext } from './routes/__root'
import { routeTree } from './routeTree.gen'

import { initAuth } from '@/lib/auth-store'
import '@/lib/i18n'

// Kick off token refresh in the browser only — localStorage is not available on the server.
if (typeof window !== 'undefined') void initAuth()

const router = createRouter({
  routeTree,
  scrollRestoration: true,
  defaultPreload: 'intent',
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
