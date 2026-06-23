import type { ReactNode } from 'react'

import { usePermissions } from '@/hooks/use-permissions'
import type { Right } from '@/lib/permissions'

interface CanAccessProps {
  /** Right(s) required to render the children — array means "any of" (OR). */
  rights: Right | readonly Right[]
  children: ReactNode
  /** Optional fallback rendered when the user lacks the right(s). */
  fallback?: ReactNode
}

/** Renders `children` only if the current user holds the required right(s). */
export function CanAccess({
  rights,
  children,
  fallback = null,
}: CanAccessProps): ReactNode {
  const { can } = usePermissions()
  return can(rights) ? children : fallback
}
