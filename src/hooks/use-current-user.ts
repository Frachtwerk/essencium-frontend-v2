import { useSuspenseQuery } from '@tanstack/react-query'
import type { UseSuspenseQueryResult } from '@tanstack/react-query'

import {
  getMeOptions,
  getMeQueryKey,
} from '@/generated/client/@tanstack/react-query.gen'
import type {
  GetMeError,
  UserRepresentation,
} from '@/generated/client/types.gen'
import { authenticatedClient } from '@/lib/auth-store'

export const currentUserQueryKey = getMeQueryKey({
  client: authenticatedClient,
})

export function useCurrentUser(): UseSuspenseQueryResult<
  UserRepresentation,
  GetMeError
> {
  return useSuspenseQuery(getMeOptions({ client: authenticatedClient }))
}
