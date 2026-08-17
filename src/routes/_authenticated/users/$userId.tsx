import { createFileRoute, redirect } from '@tanstack/react-router'

import { getMeOptions } from '@/generated/client/@tanstack/react-query.gen'
import { getFindByIdUserQueryOptions } from '@/hooks/data/users'
import { authenticatedClient } from '@/lib/auth-store'
import { getUserRights, hasRequiredRights, RIGHTS } from '@/lib/permissions'
import { UserEditPage } from '@/pages/users/user-edit-page'

export const Route = createFileRoute('/_authenticated/users/$userId')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(
      getMeOptions({ client: authenticatedClient }),
    )
    // Editing needs both: reading the user to populate the form and updating it.
    const allowed = hasRequiredRights(
      getUserRights(user),
      [RIGHTS.USER_READ, RIGHTS.USER_UPDATE],
      'all',
    )
    if (!allowed) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/' })
    }
  },
  component: UserEditPage,
  loader: ({ context: { queryClient }, params: { userId } }) =>
    queryClient.ensureQueryData(getFindByIdUserQueryOptions(Number(userId))),
})
