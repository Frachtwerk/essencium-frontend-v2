import { createFileRoute } from '@tanstack/react-router'

import { getFindAllRolesQueryOptions } from '@/hooks/data/roles'
import { paginationSearchParamsSchema } from '@/lib/pagination'
import { RolesListPage } from '@/pages/roles/roles-list-page'

export const Route = createFileRoute('/_authenticated/roles')({
  component: RolesListPage,
  validateSearch: paginationSearchParamsSchema,
  loaderDeps: ({ search: { page, size } }) => ({ page, size }),
  loader: ({ context: { queryClient }, deps: { page, size } }) =>
    queryClient.ensureQueryData(
      getFindAllRolesQueryOptions({ page, size, sort: ['name,asc'] }),
    ),
})
