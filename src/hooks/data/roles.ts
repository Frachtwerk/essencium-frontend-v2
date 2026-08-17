import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type UseMutationResult,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query'

import type {
  Create1Data,
  Create1Error,
  Create1Response,
  Delete1Data,
  Delete1Error,
  Delete1Response,
  FindAll1Error,
  Options,
  PageRole,
  Update2Error,
  Update2Response,
  UpdateObjectData,
  UpdateObjectError,
  UpdateObjectResponse,
} from '@/generated/client'
import { update2 } from '@/generated/client'
import {
  create1Mutation,
  delete1Mutation,
  findAll1Options,
  findAll1QueryKey,
  updateObjectMutation,
} from '@/generated/client/@tanstack/react-query.gen'
import { authenticatedClient } from '@/lib/auth-store'

interface ListOptions {
  page: number
  size: number
  sort?: string[]
}

export function getFindAllRolesQueryOptions(
  options: ListOptions,
): ReturnType<typeof findAll1Options> {
  return findAll1Options({ client: authenticatedClient, query: options })
}

export function useFindAllRoles(
  options: ListOptions,
): UseSuspenseQueryResult<PageRole, FindAll1Error> {
  return useSuspenseQuery(getFindAllRolesQueryOptions(options))
}

/** All roles (single large page) — for select inputs and the rights matrix columns. */
export function getAllRolesQueryOptions(): ReturnType<typeof findAll1Options> {
  return findAll1Options({
    client: authenticatedClient,
    query: { page: 0, size: 1000, sort: ['name,asc'] },
  })
}

/** All roles (single large page) — for select inputs. */
export function useAllRoles(): UseSuspenseQueryResult<PageRole, FindAll1Error> {
  return useSuspenseQuery(getAllRolesQueryOptions())
}

function useInvalidateRoles(): () => void {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({
      queryKey: findAll1QueryKey({ client: authenticatedClient }),
    })
  }
}

export function useCreateRole(): UseMutationResult<
  Create1Response,
  Create1Error,
  Options<Create1Data>
> {
  const invalidate = useInvalidateRoles()
  return useMutation({
    ...create1Mutation({ client: authenticatedClient }),
    onSuccess: invalidate,
  })
}

export function useUpdateRole(): UseMutationResult<
  UpdateObjectResponse,
  UpdateObjectError,
  Options<UpdateObjectData>
> {
  const invalidate = useInvalidateRoles()
  return useMutation({
    ...updateObjectMutation({ client: authenticatedClient }),
    onSuccess: invalidate,
  })
}

export function useDeleteRole(): UseMutationResult<
  Delete1Response,
  Delete1Error,
  Options<Delete1Data>
> {
  const invalidate = useInvalidateRoles()
  return useMutation({
    ...delete1Mutation({ client: authenticatedClient }),
    onSuccess: invalidate,
  })
}

export interface ToggleRoleRightVariables {
  authority: string
  nextChecked: boolean
}

interface ToggleRoleRightContext {
  previousRoles: PageRole | undefined
}

/**
 * Toggles a single right on the role identified by `roleName` (the API takes the
 * role name, not the id, as path param).
 *
 * The authority list the API expects is derived inside the mutation from the
 * *current* cache instead of from a snapshot captured during render, and the
 * optimistic result is written back before the request starts. That way rapid
 * consecutive toggles build on each other rather than overwriting one another.
 * The mutation scope is per role name, so two updates to the same role are sent
 * serially — the last response then reflects the last click — while updates to
 * different roles still run in parallel.
 */
export function useToggleRoleRight(
  roleName: string,
): UseMutationResult<
  Update2Response,
  Update2Error,
  ToggleRoleRightVariables,
  ToggleRoleRightContext
> {
  const queryClient = useQueryClient()
  const invalidate = useInvalidateRoles()
  const { queryKey } = getAllRolesQueryOptions()

  return useMutation({
    // Serializes concurrent updates to this role — see doc comment above.
    scope: { id: `role-rights:${roleName}` },
    mutationFn: async ({ authority, nextChecked }) => {
      const roles = queryClient.getQueryData<PageRole>(queryKey)

      const { data } = await update2({
        client: authenticatedClient,
        path: { name: roleName },
        body: {
          rights: nextAuthorities(roles, roleName, authority, nextChecked),
        },
        throwOnError: true,
      })
      return data
    },
    onMutate: ({ authority, nextChecked }) => {
      const previousRoles = queryClient.getQueryData<PageRole>(queryKey)

      queryClient.setQueryData<PageRole>(queryKey, current =>
        applyRightToggle(current, roleName, authority, nextChecked),
      )

      return { previousRoles }
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousRoles)
    },
    onSettled: invalidate,
  })
}

/** The authority list to send for `roleName` after toggling `authority`. */
export function nextAuthorities(
  roles: PageRole | undefined,
  roleName: string,
  authority: string,
  nextChecked: boolean,
): string[] {
  const role = roles?.content?.find(r => r.name === roleName)
  const current = role?.rights?.map(right => right.authority) ?? []

  return nextChecked
    ? [...new Set([...current, authority])]
    : current.filter(a => a !== authority)
}

/** A copy of the roles page with `authority` toggled on `roleName`. */
export function applyRightToggle(
  roles: PageRole | undefined,
  roleName: string,
  authority: string,
  nextChecked: boolean,
): PageRole | undefined {
  if (!roles?.content) return roles

  return {
    ...roles,
    content: roles.content.map(role => {
      if (role.name !== roleName) return role

      const rights = role.rights ?? []
      if (!nextChecked) {
        return {
          ...role,
          rights: rights.filter(right => right.authority !== authority),
        }
      }

      if (rights.some(right => right.authority === authority)) return role
      return { ...role, rights: [...rights, { authority }] }
    }),
  }
}
