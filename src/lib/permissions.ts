import type { QueryClient } from '@tanstack/react-query'
import { redirect } from '@tanstack/react-router'

import { getMeOptions } from '@/generated/client/@tanstack/react-query.gen'
import type { UserRepresentation } from '@/generated/client/types.gen'
import { authenticatedClient } from '@/lib/auth-store'

/**
 * Known backend authority names (rights). Rights are dynamic strings coming
 * from the backend, but the ones the UI gates on are enumerated here so usage
 * is type-checked and greppable. Mirrors the Essencium backend rights model.
 */
export const RIGHTS = {
  USER_CREATE: 'USER_CREATE',
  USER_READ: 'USER_READ',
  USER_UPDATE: 'USER_UPDATE',
  USER_DELETE: 'USER_DELETE',
  ROLE_CREATE: 'ROLE_CREATE',
  ROLE_READ: 'ROLE_READ',
  ROLE_UPDATE: 'ROLE_UPDATE',
  ROLE_DELETE: 'ROLE_DELETE',
  RIGHT_READ: 'RIGHT_READ',
  RIGHT_UPDATE: 'RIGHT_UPDATE',
  TRANSLATION_READ: 'TRANSLATION_READ',
  TRANSLATION_UPDATE: 'TRANSLATION_UPDATE',
  API_TOKEN: 'API_TOKEN',
  API_TOKEN_ADMIN: 'API_TOKEN_ADMIN',
} as const

export type Right = (typeof RIGHTS)[keyof typeof RIGHTS] | (string & {})

/** Flattens a user's roles into a de-duplicated list of right authorities. */
export function getUserRights(user: UserRepresentation | undefined): string[] {
  if (!user?.roles) return []
  const rights = user.roles.flatMap(
    role => role.rights?.map(right => right.authority) ?? [],
  )
  return [...new Set(rights)]
}

/**
 * How multiple required rights are combined:
 * - `any` (default): the user must hold at least one of them (OR).
 * - `all`: the user must hold every one of them (AND).
 */
export type RightsMode = 'any' | 'all'

/**
 * Checks whether the user holds the required right(s). This is the single place
 * where AND/OR semantics live — route guards, the sidebar and `CanAccess` all
 * gate through it so they cannot drift apart.
 *
 * - A single right: the user must hold exactly that right (`mode` is irrelevant).
 * - An array of rights: combined via `mode` — see {@link RightsMode}.
 * - An empty array / undefined: always allowed (no restriction).
 */
export function hasRequiredRights(
  userRights: readonly string[],
  required: Right | readonly Right[] | undefined,
  mode: RightsMode = 'any',
): boolean {
  if (required === undefined) return true
  const list: readonly Right[] = Array.isArray(required) ? required : [required]
  if (list.length === 0) return true
  return mode === 'all'
    ? list.every(right => userRights.includes(right))
    : list.some(right => userRights.includes(right))
}

/**
 * Loads the current user for use in route guards. The single place that knows
 * how `/me` is fetched, so guards cannot drift on client or caching options.
 */
export async function loadCurrentUser(
  queryClient: QueryClient,
): Promise<UserRepresentation> {
  return queryClient.ensureQueryData(
    getMeOptions({ client: authenticatedClient }),
  )
}

/**
 * Route-guard helper: loads the current user and redirects to `/forbidden`
 * unless they hold the required right(s). Returns the user so `beforeLoad`
 * callers can pass it on through the route context.
 *
 * Pass `beforeLoad`'s `location.href` as `attemptedPath` so the forbidden page
 * can offer a way back to where the user was headed.
 */
export async function assertRights(
  queryClient: QueryClient,
  requiredRights: Right | readonly Right[] | undefined,
  mode: RightsMode = 'any',
  attemptedPath?: string,
): Promise<UserRepresentation> {
  const user = await loadCurrentUser(queryClient)
  if (!hasRequiredRights(getUserRights(user), requiredRights, mode)) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({
      to: '/forbidden',
      search: attemptedPath ? { redirect: attemptedPath } : {},
    })
  }
  return user
}
