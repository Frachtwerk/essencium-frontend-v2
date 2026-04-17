import '@/styles/globals.css'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import type { JSX, ReactNode } from 'react'

export const Route = createRootRoute({
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
      <Outlet />
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
