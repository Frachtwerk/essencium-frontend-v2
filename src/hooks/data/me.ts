import {
  useMutation,
  UseMutationResult,
  useQueryClient,
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query'

import type {
  GetMeError,
  UpdateMePartialError,
  UpdateMePartialResponse,
  UserRepresentation,
} from '@/generated/client'
import {
  getMeOptions,
  getMeQueryKey,
} from '@/generated/client/@tanstack/react-query.gen'
import { updateMePartial } from '@/generated/client/sdk.gen'
import { authenticatedClient } from '@/lib/auth-store'

/** Canonical cache key for the current-user query — shared by useGetMe, useUpdateMePartial and useCurrentUser. */
export const meQueryKey = getMeQueryKey({ client: authenticatedClient })

/**
 * The generated PATCH body type is `{ [key: string]: unknown }` because
 * `backend/openapi.yaml` declares no schema for it — this is the actual
 * contract (mirrors UserDto's editable, non-relational fields).
 */
export interface UpdateMePartialBody {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  mobile?: string
  locale?: string
}

export function useGetMe(): UseSuspenseQueryResult<
  UserRepresentation,
  GetMeError
> {
  return useSuspenseQuery(getMeOptions({ client: authenticatedClient }))
}

export function useUpdateMePartial(): UseMutationResult<
  UpdateMePartialResponse,
  UpdateMePartialError,
  { body: UpdateMePartialBody }
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ body }: { body: UpdateMePartialBody }) => {
      const { data } = await updateMePartial({
        client: authenticatedClient,
        // The generated body type is an untyped index signature (see
        // UpdateMePartialBody above) — this cast is safe because `body`
        // only ever contains the string fields declared there.
        body: body as Record<string, unknown>,
        throwOnError: true,
      })
      return data
    },
    onSuccess: updated => {
      queryClient.setQueryData(meQueryKey, updated)
    },
  })
}
