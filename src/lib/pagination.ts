import { z } from 'zod'

/** Type-safe search params for paginated list routes. */
export const paginationSearchParamsSchema = z.object({
  page: z.number().optional().default(0),
  size: z.number().optional().default(10),
})

export type PaginationSearchParams = z.infer<
  typeof paginationSearchParamsSchema
>
