import { createFileRoute, redirect } from '@tanstack/react-router'

import { getMeOptions } from '@/generated/client/@tanstack/react-query.gen'
import { authenticatedClient } from '@/lib/auth-store'
import { getUserRights, hasRequiredRights, RIGHTS } from '@/lib/permissions'
import { UserCreatePage } from '@/pages/users/user-create-page'

export const Route = createFileRoute('/_authenticated/users/new')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(
      getMeOptions({ client: authenticatedClient }),
    )
    if (!hasRequiredRights(getUserRights(user), RIGHTS.USER_CREATE)) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/' })
    }
  },
  component: UserCreatePage,
})
