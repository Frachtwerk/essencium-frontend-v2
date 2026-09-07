import { createFileRoute } from '@tanstack/react-router'

import { getFindByIdUserQueryOptions } from '@/hooks/data/users'
import { assertRights, RIGHTS } from '@/lib/permissions'
import { UserEditPage } from '@/pages/users/user-edit-page'

export const Route = createFileRoute('/_authenticated/users/$userId')({
  beforeLoad: async ({ context: { queryClient }, location }) => {
    await assertRights(
      queryClient,
      [RIGHTS.USER_READ, RIGHTS.USER_UPDATE],
      'all',
      location.href,
    )
  },
  component: UserEditPage,
  loader: ({ context: { queryClient }, params: { userId } }) =>
    queryClient.ensureQueryData(getFindByIdUserQueryOptions(Number(userId))),
})
