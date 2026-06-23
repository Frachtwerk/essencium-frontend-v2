import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'

/** Wraps next-themes with the project defaults (class-based dark mode). */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>): React.ReactElement {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
