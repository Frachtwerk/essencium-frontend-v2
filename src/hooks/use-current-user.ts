import type { UseSuspenseQueryResult } from '@tanstack/react-query'

import type {
  GetMeError,
  UserRepresentation,
} from '@/generated/client/types.gen'
import { meQueryKey, useGetMe } from '@/hooks/data/me'

export const currentUserQueryKey = meQueryKey

/** Alias for `useGetMe` — shares its query cache entry. */
export function useCurrentUser(): UseSuspenseQueryResult<
  UserRepresentation,
  GetMeError
> {
  return useGetMe()
}
