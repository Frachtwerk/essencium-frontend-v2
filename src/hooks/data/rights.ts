import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query'

import type { FindAll5Error, PageRight } from '@/generated/client'
import { findAll5Options } from '@/generated/client/@tanstack/react-query.gen'
import { authenticatedClient } from '@/lib/auth-store'

/** All rights (single large page) — for the role rights selection. */
export function useAllRights(): UseSuspenseQueryResult<
  PageRight,
  FindAll5Error
> {
  return useSuspenseQuery(
    findAll5Options({
      client: authenticatedClient,
      query: { page: 0, size: 1000, sort: ['authority,asc'] },
    }),
  )
}
