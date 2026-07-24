import { RiAddLine, RiKeyLine } from '@remixicon/react'
import { getRouteApi } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { ApiTokenFormDialog } from './api-token-form-dialog'
import type { ApiTokenFormValues } from './api-token-form-schema'
import { ApiTokenRevealDialog } from './api-token-reveal-dialog'
import { ApiTokensTable } from './api-tokens-table'

import { PageHeader } from '@/components/layout/page-header'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import type {
  ApiTokenDto,
  ApiTokenRepresentation,
} from '@/generated/client/types.gen'
import {
  useCreateApiToken,
  useDeleteApiToken,
  useFindAllApiTokens,
  useRevokeApiToken,
} from '@/hooks/data/api-tokens'

const route = getRouteApi('/_authenticated/api-tokens')

export function ApiTokensListPage(): React.ReactElement {
  const { t } = useTranslation()
  const { page, size } = route.useSearch()
  const { data: tokensPage } = useFindAllApiTokens({ page, size })
  const createApiToken = useCreateApiToken()
  const revokeApiToken = useRevokeApiToken()
  const deleteApiToken = useDeleteApiToken()

  const [formOpen, setFormOpen] = useState(false)
  const [createdToken, setCreatedToken] = useState<
    ApiTokenRepresentation | undefined
  >(undefined)
  const [tokenToRevoke, setTokenToRevoke] = useState<
    ApiTokenRepresentation | undefined
  >(undefined)
  const [tokenToDelete, setTokenToDelete] = useState<
    ApiTokenRepresentation | undefined
  >(undefined)

  function handleCreate(values: ApiTokenFormValues): void {
    const body: ApiTokenDto = {
      description: values.description,
      validUntil: values.validUntil || undefined,
      rights: values.rights,
    }
    createApiToken.mutate(
      { body },
      {
        onSuccess: created => {
          toast.success(t('apiTokens.createSuccess'))
          setFormOpen(false)
          setCreatedToken(created)
        },
        onError: () => toast.error(t('apiTokens.saveError')),
      },
    )
  }

  function confirmRevoke(): void {
    if (!tokenToRevoke?.id) return
    revokeApiToken.mutate(
      {
        path: { id: tokenToRevoke.id as unknown as number },
        body: { status: 'REVOKED' },
      },
      {
        onSuccess: () => {
          toast.success(t('apiTokens.revokeSuccess'))
          setTokenToRevoke(undefined)
        },
        onError: () => toast.error(t('apiTokens.revokeError')),
      },
    )
  }

  function confirmDelete(): void {
    if (!tokenToDelete?.id) return
    deleteApiToken.mutate(
      { path: { id: tokenToDelete.id as unknown as number } },
      {
        onSuccess: () => {
          toast.success(t('apiTokens.deleteSuccess'))
          setTokenToDelete(undefined)
        },
        onError: () => toast.error(t('apiTokens.deleteError')),
      },
    )
  }

  const hasTokens = Boolean(tokensPage.totalElements)

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={t('apiTokens.title')}
        actions={
          hasTokens ? (
            <Button onClick={() => setFormOpen(true)}>
              <RiAddLine className="size-4" />
              {t('apiTokens.create')}
            </Button>
          ) : undefined
        }
      />
      {hasTokens ? (
        <ApiTokensTable
          tokensPage={tokensPage}
          page={page}
          size={size}
          onRevoke={setTokenToRevoke}
          onDelete={setTokenToDelete}
        />
      ) : (
        <EmptyState
          icon={RiKeyLine}
          title={t('apiTokens.empty.title')}
          description={t('apiTokens.empty.description')}
          action={
            <Button onClick={() => setFormOpen(true)}>
              <RiAddLine className="size-4" />
              {t('apiTokens.create')}
            </Button>
          }
        />
      )}

      <ApiTokenFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreate}
        isSubmitting={createApiToken.isPending}
      />

      <ApiTokenRevealDialog
        token={createdToken}
        onOpenChange={isOpen => {
          if (!isOpen) setCreatedToken(undefined)
        }}
      />

      <ConfirmDialog
        open={tokenToRevoke !== undefined}
        onOpenChange={isOpen => {
          if (!isOpen) setTokenToRevoke(undefined)
        }}
        title={t('apiTokens.revokeTitle')}
        description={t('apiTokens.revokeConfirm', {
          description: tokenToRevoke?.description ?? '',
        })}
        confirmLabel={t('apiTokens.revoke')}
        onConfirm={confirmRevoke}
        isPending={revokeApiToken.isPending}
      />

      <ConfirmDialog
        open={tokenToDelete !== undefined}
        onOpenChange={isOpen => {
          if (!isOpen) setTokenToDelete(undefined)
        }}
        title={t('apiTokens.deleteTitle')}
        description={t('apiTokens.deleteConfirm', {
          description: tokenToDelete?.description ?? '',
        })}
        confirmLabel={t('common.delete')}
        onConfirm={confirmDelete}
        isPending={deleteApiToken.isPending}
      />
    </div>
  )
}
