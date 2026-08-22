import type { ReactNode } from 'react'

import { usePermissions } from '@/hooks/use-permissions'
import type { Right, RightsMode } from '@/lib/permissions'

interface CanAccessProps {
  /** Right(s) required to render the children — combined via `mode`. */
  rights: Right | readonly Right[]
  /** How multiple rights combine: `any` (default, OR) or `all` (AND). */
  mode?: RightsMode
  children: ReactNode
  /** Optional fallback rendered when the user lacks the right(s). */
  fallback?: ReactNode
}

/** Renders `children` only if the current user holds the required right(s). */
export function CanAccess({
  rights,
  mode,
  children,
  fallback = null,
}: CanAccessProps): ReactNode {
  const { can } = usePermissions()
  return can(rights, mode) ? children : fallback
}
