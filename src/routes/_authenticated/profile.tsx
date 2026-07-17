import { createFileRoute } from '@tanstack/react-router'

import { getMeOptions } from '@/generated/client/@tanstack/react-query.gen'
import { authenticatedClient } from '@/lib/auth-store'
import { ProfilePage } from '@/pages/profile/profile-page'

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getMeOptions({ client: authenticatedClient })),
})
