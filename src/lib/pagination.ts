import { z } from 'zod'

/** Type-safe search params for paginated list routes. */
export const paginationSearchParamsSchema = z.object({
  page: z.number().optional().default(0),
  size: z.number().optional().default(10),
})

/** Spring-style sort token: `property,asc` | `property,desc`. */
export type SortDirection = 'asc' | 'desc'

/** Parse a `property,dir` token into a TanStack `SortingState` entry. */
export function parseSort(
  sort: string | undefined,
): { id: string; desc: boolean }[] {
  if (!sort) return []
  const [id, dir] = sort.split(',')
  if (!id) return []
  return [{ id, desc: dir === 'desc' }]
}

/** Serialize a TanStack `SortingState` entry back into a `property,dir` token. */
export function serializeSort(
  sorting: { id: string; desc: boolean }[],
): string | undefined {
  const first = sorting[0]
  if (!first) return undefined
  return `${first.id},${first.desc ? 'desc' : 'asc'}`
}

export type PaginationSearchParams = z.infer<
  typeof paginationSearchParamsSchema
>
