import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { ForbiddenError } from '@/components/error-fallback'

export const Route = createFileRoute('/_authenticated/forbidden')({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: ForbiddenErrorPage,
})

function ForbiddenErrorPage(): React.ReactElement {
  return <ForbiddenError />
}
