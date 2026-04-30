import { createRouter } from '@tanstack/react-router'

import { queryClient, type RouterContext } from './routes/__root'
import { routeTree } from './routeTree.gen'

import { initAuth } from '@/lib/auth-store'

// Kick off token refresh immediately so route guards can await waitForAuth().
void initAuth()

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
