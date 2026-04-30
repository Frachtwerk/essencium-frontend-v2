import { useSuspenseQuery } from '@tanstack/react-query'

import {
  getMeOptions,
  getMeQueryKey,
} from '@/generated/client/@tanstack/react-query.gen'
import { authenticatedClient } from '@/lib/auth-store'

export const currentUserQueryKey = getMeQueryKey({
  client: authenticatedClient,
})

export function useCurrentUser(): ReturnType<typeof useSuspenseQuery> {
  return useSuspenseQuery(getMeOptions({ client: authenticatedClient }))
}
