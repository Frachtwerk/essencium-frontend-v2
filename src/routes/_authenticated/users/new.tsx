import { createFileRoute } from '@tanstack/react-router'

import { UserCreatePage } from '@/pages/users/user-create-page'

export const Route = createFileRoute('/_authenticated/users/new')({
  component: UserCreatePage,
})
