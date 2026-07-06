import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { getFindAllUsersQueryOptions } from '@/hooks/data/users'
import { paginationSearchParamsSchema } from '@/lib/pagination'
import { UsersListPage } from '@/pages/users/users-list-page'

const usersSearchSchema = paginationSearchParamsSchema.extend({
  name: z.string().optional(),
  email: z.string().optional(),
  roles: z.array(z.string()).optional(),
})

export const Route = createFileRoute('/_authenticated/users/')({
  component: UsersListPage,
  validateSearch: usersSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.ensureQueryData(
      getFindAllUsersQueryOptions({
        page: deps.page,
        size: deps.size,
        sort: ['email,asc'],
        name: deps.name,
        email: deps.email,
        roles: deps.roles,
      }),
    ),
})
