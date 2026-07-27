import { createFileRoute, redirect } from '@tanstack/react-router'

import { getMeOptions } from '@/generated/client/@tanstack/react-query.gen'
import { getFindAllApiTokensQueryOptions } from '@/hooks/data/api-tokens'
import { authenticatedClient } from '@/lib/auth-store'
import { paginationSearchParamsSchema } from '@/lib/pagination'
import { getUserRights, hasRequiredRights, RIGHTS } from '@/lib/permissions'
import { ApiTokensListPage } from '@/pages/api-tokens/api-tokens-list-page'

export const Route = createFileRoute('/_authenticated/api-tokens')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(
      getMeOptions({ client: authenticatedClient }),
    )
    if (!hasRequiredRights(getUserRights(user), RIGHTS.API_TOKEN)) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/' })
    }
  },
  component: ApiTokensListPage,
  validateSearch: paginationSearchParamsSchema,
  loaderDeps: ({ search: { page, size } }) => ({ page, size }),
  loader: ({ context: { queryClient }, deps: { page, size } }) =>
    queryClient.ensureQueryData(
      getFindAllApiTokensQueryOptions({ page, size }),
    ),
})
