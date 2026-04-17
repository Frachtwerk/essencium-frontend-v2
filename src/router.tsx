import { createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'

export function getRouter(): ReturnType<typeof createRouter> {
  return createRouter({ routeTree, scrollRestoration: true })
}
