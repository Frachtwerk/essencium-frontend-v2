import { createFileRoute } from '@tanstack/react-router'

import { getFindAllUsersQueryOptions } from '@/hooks/data/users'
import { paginationSearchParamsSchema } from '@/lib/pagination'
import { UsersListPage } from '@/pages/users/users-list-page'

export const Route = createFileRoute('/_authenticated/users/')({
  component: UsersListPage,
  validateSearch: paginationSearchParamsSchema,
  loaderDeps: ({ search: { page, size } }) => ({ page, size }),
  loader: ({ context: { queryClient }, deps: { page, size } }) =>
    queryClient.ensureQueryData(
      getFindAllUsersQueryOptions({ page, size, sort: ['email,asc'] }),
    ),
})
