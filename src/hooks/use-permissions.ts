import { useCurrentUser } from '@/hooks/use-current-user'
import { getUserRights, hasRequiredRights, type Right } from '@/lib/permissions'

export interface UsePermissionsResult {
  /** The current user's flattened right authorities. */
  rights: string[]
  /** Whether the user holds the required right(s) — see {@link hasRequiredRights}. */
  can: (required: Right | readonly Right[] | undefined) => boolean
}

/** Exposes the current user's rights and a `can()` check for gating UI. */
export function usePermissions(): UsePermissionsResult {
  const { data: user } = useCurrentUser()
  const rights = getUserRights(user)
  return {
    rights,
    can: required => hasRequiredRights(rights, required),
  }
}
