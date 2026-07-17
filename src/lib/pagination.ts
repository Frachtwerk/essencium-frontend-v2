import type { SortingState } from '@tanstack/react-table'
import { z } from 'zod'

/** Type-safe search params for paginated list routes. */
export const paginationSearchParamsSchema = z.object({
  page: z.number().optional().default(0),
  size: z.number().optional().default(10),
})

/** Spring-style sort token: `property,asc` | `property,desc`. */
export type SortDirection = 'asc' | 'desc'

/** Parse a `property,dir` token into a TanStack `SortingState`. */
export function parseSort(sort: string | undefined): SortingState {
  if (!sort) return []
  const [id, dir] = sort.split(',')
  if (!id) return []
  return [{ id, desc: dir === 'desc' }]
}

/** Serialize a TanStack `SortingState` back into a `property,dir` token. */
export function serializeSort(sorting: SortingState): string | undefined {
  const first = sorting[0]
  if (!first) return undefined
  return `${first.id},${first.desc ? 'desc' : 'asc'}`
}

export type PaginationSearchParams = z.infer<
  typeof paginationSearchParamsSchema
>
