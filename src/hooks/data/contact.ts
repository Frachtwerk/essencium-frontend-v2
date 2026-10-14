import { useMutation, type UseMutationResult } from '@tanstack/react-query'

import type {
  Options,
  SendContactRequestData,
  SendContactRequestError,
} from '@/generated/client'
import { sendContactRequestMutation } from '@/generated/client/@tanstack/react-query.gen'
import { authenticatedClient } from '@/lib/auth-store'

export function useSendContactRequest(): UseMutationResult<
  unknown,
  SendContactRequestError,
  Options<SendContactRequestData>
> {
  return useMutation(
    sendContactRequestMutation({ client: authenticatedClient }),
  )
}
