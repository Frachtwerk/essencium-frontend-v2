import { createFileRoute } from '@tanstack/react-router'

import { getFindByIdUserQueryOptions } from '@/hooks/data/users'
import { UserEditPage } from '@/pages/users/user-edit-page'

export const Route = createFileRoute('/_authenticated/users/$userId')({
  component: UserEditPage,
  loader: ({ context: { queryClient }, params: { userId } }) =>
    queryClient.ensureQueryData(getFindByIdUserQueryOptions(Number(userId))),
})
