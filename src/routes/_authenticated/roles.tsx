import { createFileRoute, redirect } from '@tanstack/react-router'

import { getMeOptions } from '@/generated/client/@tanstack/react-query.gen'
import { getFindAllRolesQueryOptions } from '@/hooks/data/roles'
import { authenticatedClient } from '@/lib/auth-store'
import { paginationSearchParamsSchema } from '@/lib/pagination'
import { getUserRights, hasRequiredRights, RIGHTS } from '@/lib/permissions'
import { RolesListPage } from '@/pages/roles/roles-list-page'

export const Route = createFileRoute('/_authenticated/roles')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(
      getMeOptions({ client: authenticatedClient }),
    )
    const allowed = hasRequiredRights(
      getUserRights(user),
      [RIGHTS.ROLE_READ, RIGHTS.RIGHT_READ],
      'all',
    )
    if (!allowed) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/' })
    }
  },
  component: RolesListPage,
  validateSearch: paginationSearchParamsSchema,
  loaderDeps: ({ search: { page, size } }) => ({ page, size }),
  loader: ({ context: { queryClient }, deps: { page, size } }) =>
    queryClient.ensureQueryData(
      getFindAllRolesQueryOptions({ page, size, sort: ['name,asc'] }),
    ),
})
