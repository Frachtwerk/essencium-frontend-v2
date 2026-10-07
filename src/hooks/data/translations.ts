import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type UseMutationResult,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query'

import type {
  DeleteTranslationData,
  DeleteTranslationError,
  GetTranslationFileError,
  Options,
  UpdateSingleTranslationData,
  UpdateSingleTranslationError,
  UpdateSingleTranslationResponse,
} from '@/generated/client'
import {
  deleteTranslationMutation,
  getTranslationFileOptions,
  updateSingleTranslationMutation,
} from '@/generated/client/@tanstack/react-query.gen'
import { authenticatedClient } from '@/lib/auth-store'
import {
  parseTranslationFile,
  type TranslationEntry,
  type TranslationLocale,
} from '@/lib/translations'

export function getTranslationsQueryOptions(
  locale: TranslationLocale,
): ReturnType<typeof getTranslationFileOptions> {
  return getTranslationFileOptions({
    client: authenticatedClient,
    path: { locale },
    query: { type: 'json' },
    parseAs: 'json',
  })
}

export function useTranslations(
  locale: TranslationLocale,
): UseSuspenseQueryResult<TranslationEntry[], GetTranslationFileError> {
  return useSuspenseQuery({
    ...getTranslationsQueryOptions(locale),
    select: parseTranslationFile,
  })
}

function useInvalidateTranslations(): () => void {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({
      queryKey: [{ _id: 'getTranslationFile' }],
    })
  }
}

export function useUpdateTranslation(): UseMutationResult<
  UpdateSingleTranslationResponse,
  UpdateSingleTranslationError,
  Options<UpdateSingleTranslationData>
> {
  const invalidate = useInvalidateTranslations()
  return useMutation({
    ...updateSingleTranslationMutation({
      client: authenticatedClient,
      bodySerializer: body => body,
    }),
    onSuccess: invalidate,
  })
}

export function useDeleteTranslation(): UseMutationResult<
  unknown,
  DeleteTranslationError,
  Options<DeleteTranslationData>
> {
  const invalidate = useInvalidateTranslations()
  return useMutation({
    ...deleteTranslationMutation({ client: authenticatedClient }),
    onSuccess: invalidate,
  })
}
