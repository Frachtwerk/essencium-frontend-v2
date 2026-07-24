import { createFileRoute } from '@tanstack/react-router'

import { getFindAllApiTokensQueryOptions } from '@/hooks/data/api-tokens'
import { paginationSearchParamsSchema } from '@/lib/pagination'
import { ApiTokensListPage } from '@/pages/api-tokens/api-tokens-list-page'

export const Route = createFileRoute('/_authenticated/api-tokens')({
  component: ApiTokensListPage,
  validateSearch: paginationSearchParamsSchema,
  loaderDeps: ({ search: { page, size } }) => ({ page, size }),
  loader: ({ context: { queryClient }, deps: { page, size } }) =>
    queryClient.ensureQueryData(
      getFindAllApiTokensQueryOptions({ page, size }),
    ),
})
