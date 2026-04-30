import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { AuthContext } from '@/hooks/use-auth'
import { currentUserQueryKey } from '@/hooks/use-current-user'
import {
  login as authLogin,
  logout as authLogout,
  resetAuth,
} from '@/lib/auth-store'

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
