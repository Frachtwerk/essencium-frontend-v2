import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { getFindAllRightsQueryOptions } from '@/hooks/data/rights'
import { getAllRolesQueryOptions } from '@/hooks/data/roles'
import { paginationSearchParamsSchema } from '@/lib/pagination'
import { assertRights, RIGHTS } from '@/lib/permissions'
import { RightsPage } from '@/pages/rights/rights-page'

export const extendedPaginationSearchSchema =
  paginationSearchParamsSchema.extend({
    sort: z.string().optional(),
  })

export const Route = createFileRoute('/_authenticated/rights')({
  beforeLoad: async ({ context: { queryClient }, location }) => {
    await assertRights(
      queryClient,
      [RIGHTS.ROLE_UPDATE, RIGHTS.RIGHT_READ],
      'all',
      location.href,
    )
  },
  component: RightsPage,
  validateSearch: extendedPaginationSearchSchema,
  loaderDeps: ({ search: { page, size, sort } }) => ({ page, size, sort }),
  loader: ({ context: { queryClient }, deps: { page, size, sort } }) => {
    // Roles are the matrix columns — always the full set, never paginated
    // alongside the rights rows.
    void queryClient.ensureQueryData(getAllRolesQueryOptions())
    void queryClient.ensureQueryData(
      getFindAllRightsQueryOptions({
        page,
        size,
        ...(sort ? { sort: [sort] } : {}),
      }),
    )
  },
})
