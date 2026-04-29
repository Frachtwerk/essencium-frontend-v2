import '@/styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Suspense } from 'react'
import type { JSX, ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

export const queryClient = new QueryClient()

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Essencium' },
    ],
    links: [{ rel: 'icon', href: '/favicon.ico' }],
  }),
  component: RootComponent,
})

function RootComponent(): JSX.Element {
  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={<p>Unbekannter Fehler</p>}>
          <Suspense>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
        {import.meta.env.DEV && (
          <>
            <TanStackRouterDevtools position="bottom-right" />
            <ReactQueryDevtools buttonPosition="bottom-left" />
          </>
        )}
      </QueryClientProvider>
    </RootDocument>
  )
}

function RootDocument({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <html lang="de">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground font-sans antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
