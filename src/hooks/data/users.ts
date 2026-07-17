import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type UseMutationResult,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query'

import type {
  CreateData,
  CreateError,
  CreateResponse,
  DeleteData,
  DeleteError,
  DeleteResponse,
  FindAllError,
  FindByIdError,
  Options,
  PageUserRepresentation,
  TerminateData,
  TerminateError,
  TerminateResponse,
  UpdateData,
  UpdateError,
  UpdateResponse,
  UserRepresentation,
} from '@/generated/client'
import {
  createMutation,
  deleteMutation,
  findAllOptions,
  findAllQueryKey,
  findByIdOptions,
  findByIdQueryKey,
  terminateMutation,
  updateMutation,
} from '@/generated/client/@tanstack/react-query.gen'
import { authenticatedClient } from '@/lib/auth-store'

interface ListOptions {
  page: number
  size: number
  sort?: string[]
  name?: string
  email?: string
  roles?: string[]
}

export function getFindAllUsersQueryOptions(
  options: ListOptions,
): ReturnType<typeof findAllOptions> {
  const { page, size, sort, name, email, roles } = options
  return findAllOptions({
    client: authenticatedClient,
    query: {
      page,
      size,
      sort,
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
      ...(roles && roles.length ? { roles: roles as unknown as number[] } : {}),
    },
  })
}

export function useFindAllUsers(
  options: ListOptions,
): UseSuspenseQueryResult<PageUserRepresentation, FindAllError> {
  return useSuspenseQuery(getFindAllUsersQueryOptions(options))
}

export function getFindByIdUserQueryOptions(
  id: number,
): ReturnType<typeof findByIdOptions> {
  return findByIdOptions({ client: authenticatedClient, path: { id } })
}

export function useFindByIdUser(
  id: number,
): UseSuspenseQueryResult<UserRepresentation, FindByIdError> {
  return useSuspenseQuery(getFindByIdUserQueryOptions(id))
}

export function useCreateUser(): UseMutationResult<
  CreateResponse,
  CreateError,
  Options<CreateData>
> {
  const queryClient = useQueryClient()
  return useMutation({
    ...createMutation({ client: authenticatedClient }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: findAllQueryKey({ client: authenticatedClient }),
      })
    },
  })
}

export function useUpdateUser(): UseMutationResult<
  UpdateResponse,
  UpdateError,
  Options<UpdateData>
> {
  const queryClient = useQueryClient()
  return useMutation({
    ...updateMutation({ client: authenticatedClient }),
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(
        findByIdQueryKey({
          client: authenticatedClient,
          path: { id: variables.path.id },
        }),
        updated,
      )
      void queryClient.invalidateQueries({
        queryKey: findAllQueryKey({ client: authenticatedClient }),
      })
    },
  })
}

export function useDeleteUser(): UseMutationResult<
  DeleteResponse,
  DeleteError,
  Options<DeleteData>
> {
  const queryClient = useQueryClient()
  return useMutation({
    ...deleteMutation({ client: authenticatedClient }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: findAllQueryKey({ client: authenticatedClient }),
      })
    },
  })
}

export function useTerminateUser(): UseMutationResult<
  TerminateResponse,
  TerminateError,
  Options<TerminateData>
> {
  return useMutation(terminateMutation({ client: authenticatedClient }))
}
