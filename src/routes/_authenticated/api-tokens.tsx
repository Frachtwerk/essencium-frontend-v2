import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { getMeOptions } from '@/generated/client/@tanstack/react-query.gen'
import {
  getFindAllAdminApiTokensQueryOptions,
  getFindAllApiTokensQueryOptions,
} from '@/hooks/data/api-tokens'
import { authenticatedClient } from '@/lib/auth-store'
import { paginationSearchParamsSchema } from '@/lib/pagination'
import { getUserRights, hasRequiredRights, RIGHTS } from '@/lib/permissions'
import { ApiTokensListPage } from '@/pages/api-tokens/api-tokens-list-page'

const apiTokensSearchSchema = paginationSearchParamsSchema.extend({
  tab: z.enum(['myTokens', 'allTokens']).optional(),
  sort: z.string().optional().default('createdAt,desc'),
  // The admin tab filters/sorts/paginates client-side, but its state still lives in the URL
  // so it survives tab switches and reloads like the myTokens tab does. Kept under
  // separate keys so neither tab overwrites the other's view.
  adminPage: z.number().optional().default(0),
  adminSort: z.string().optional().default('user,asc'),
  adminSearch: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/api-tokens')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(
      getMeOptions({ client: authenticatedClient }),
    )
    const userRights = getUserRights(user)
    const canSelf = hasRequiredRights(userRights, RIGHTS.API_TOKEN)
    const canAdmin = hasRequiredRights(userRights, RIGHTS.API_TOKEN_ADMIN)
    if (!canSelf && !canAdmin) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/' })
    }
    return { canSelf, canAdmin }
  },
  component: ApiTokensListPage,
  validateSearch: apiTokensSearchSchema,
  loaderDeps: ({ search: { page, size, sort } }) => ({ page, size, sort }),
  loader: ({
    context: { queryClient, canSelf, canAdmin },
    deps: { page, size, sort },
  }) =>
    Promise.all([
      canSelf
        ? queryClient.ensureQueryData(
            getFindAllApiTokensQueryOptions({ page, size, sort }),
          )
        : undefined,
      canAdmin
        ? queryClient.ensureQueryData(getFindAllAdminApiTokensQueryOptions())
        : undefined,
    ]),
})
