import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type UseMutationResult,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query'

import type {
  Create3Data,
  Create3Error,
  Create3Response,
  Delete3Data,
  Delete3Error,
  Delete3Response,
  FindAll3Error,
  GetTokenExpirationInfoError,
  Options,
  PageApiTokenRepresentation,
  Update5Data,
  Update5Error,
  Update5Response,
} from '@/generated/client'
import {
  create3Mutation,
  delete3Mutation,
  findAll3Options,
  findAll3QueryKey,
  getTokenExpirationInfoOptions,
  update5Mutation,
} from '@/generated/client/@tanstack/react-query.gen'
import { authenticatedClient } from '@/lib/auth-store'

interface ListOptions {
  page: number
  size: number
}

export function getFindAllApiTokensQueryOptions(
  options: ListOptions,
): ReturnType<typeof findAll3Options> {
  const { page, size } = options
  return findAll3Options({
    client: authenticatedClient,
    query: { page, size, sort: ['createdAt,desc'] },
  })
}

export function useFindAllApiTokens(
  options: ListOptions,
): UseSuspenseQueryResult<PageApiTokenRepresentation, FindAll3Error> {
  return useSuspenseQuery(getFindAllApiTokensQueryOptions(options))
}

/** Default token validity (in seconds) applied by the backend when `validUntil` is omitted. */
export function useTokenExpirationInfo(): UseSuspenseQueryResult<
  number,
  GetTokenExpirationInfoError
> {
  return useSuspenseQuery(
    getTokenExpirationInfoOptions({ client: authenticatedClient }),
  )
}

function useInvalidateApiTokens(): () => void {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({
      queryKey: findAll3QueryKey({ client: authenticatedClient }),
    })
  }
}

export function useCreateApiToken(): UseMutationResult<
  Create3Response,
  Create3Error,
  Options<Create3Data>
> {
  const invalidate = useInvalidateApiTokens()
  return useMutation({
    ...create3Mutation({ client: authenticatedClient }),
    onSuccess: invalidate,
  })
}

/**
 * `path.id` is a UUID string (see `ApiTokenRepresentation.id`), but
 * `backend/openapi.yaml` mis-declares the `{id}` path parameter as
 * `type: integer` for this endpoint — the generated `Delete3Data.path.id`
 * type is `number` as a result. Cast at the call site;
 */
export function useDeleteApiToken(): UseMutationResult<
  Delete3Response,
  Delete3Error,
  Options<Delete3Data>
> {
  const invalidate = useInvalidateApiTokens()
  return useMutation({
    ...delete3Mutation({ client: authenticatedClient }),
    onSuccess: invalidate,
  })
}

/**
 * Revokes an API token. Per its description, the PATCH endpoint only
 * allows a status update to `REVOKED` — the generated body type is
 * `{ [key: string]: unknown }` because `backend/openapi.yaml` declares no
 * schema for it. Same UUID/`number` path-id mismatch as
 * {@link useDeleteApiToken}.
 */
export function useRevokeApiToken(): UseMutationResult<
  Update5Response,
  Update5Error,
  Options<Update5Data>
> {
  const invalidate = useInvalidateApiTokens()
  return useMutation({
    ...update5Mutation({ client: authenticatedClient }),
    onSuccess: invalidate,
  })
}
