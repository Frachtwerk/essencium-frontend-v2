import { createFileRoute } from '@tanstack/react-router'

import { assertRights, RIGHTS } from '@/lib/permissions'
import { UserCreatePage } from '@/pages/users/user-create-page'

export const Route = createFileRoute('/_authenticated/users/new')({
  beforeLoad: async ({ context: { queryClient }, location }) => {
    await assertRights(queryClient, RIGHTS.USER_CREATE, 'any', location.href)
  },
  component: UserCreatePage,
})
