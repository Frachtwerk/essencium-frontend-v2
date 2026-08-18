import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { getMeOptions } from '@/generated/client/@tanstack/react-query.gen'
import { getFindAllUsersQueryOptions } from '@/hooks/data/users'
import { authenticatedClient } from '@/lib/auth-store'
import { paginationSearchParamsSchema } from '@/lib/pagination'
import { getUserRights, hasRequiredRights, RIGHTS } from '@/lib/permissions'
import { UsersListPage } from '@/pages/users/users-list-page'

const usersSearchSchema = paginationSearchParamsSchema.extend({
  name: z.string().optional(),
  email: z.string().optional(),
  roles: z.array(z.string()).optional(),
  sort: z.string().optional().default('email,asc'),
})

export const Route = createFileRoute('/_authenticated/users/')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(
      getMeOptions({ client: authenticatedClient }),
    )
    if (!hasRequiredRights(getUserRights(user), RIGHTS.USER_READ)) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/' })
    }
  },
  component: UsersListPage,
  validateSearch: usersSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.ensureQueryData(
      getFindAllUsersQueryOptions({
        page: deps.page,
        size: deps.size,
        sort: [deps.sort],
        name: deps.name,
        email: deps.email,
        roles: deps.roles,
      }),
    ),
})
