import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createContext, use, useCallback } from 'react'

import { currentUserQueryKey } from '@/hooks/use-current-user'
import {
  login as authLogin,
  logout as authLogout,
  resetAuth,
} from '@/lib/auth-store'

export interface AuthContextValue {
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  const queryClient = useQueryClient()

  const login = useCallback(
    async (username: string, password: string) => {
      await authLogin(username, password)
      await queryClient.invalidateQueries({ queryKey: currentUserQueryKey })
    },
    [queryClient],
  )

  const logoutMutation = useMutation({
    mutationFn: () => authLogout(),
    onSettled: () => {
      resetAuth()
      queryClient.clear()
    },
  })

  const logout = useCallback(
    () => logoutMutation.mutateAsync(),
    [logoutMutation],
  )

  return <AuthContext value={{ login, logout }}>{children}</AuthContext>
}

export function useAuth(): AuthContextValue {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
