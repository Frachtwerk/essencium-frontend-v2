import { RiKeyLine } from '@remixicon/react'
import { getRouteApi } from '@tanstack/react-router'
import type { SortingState, Updater } from '@tanstack/react-table'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { AllApiTokensFilterBar } from './all-api-tokens-filter-bar'
import { AllApiTokensTable } from './all-api-tokens-table'

import { PageHeader } from '@/components/layout/page-header'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { EmptyState } from '@/components/shared/empty-state'
import type { ApiTokenRepresentation } from '@/generated/client/types.gen'
import {
  useDeleteApiToken,
  useFindAllAdminApiTokens,
  useRevokeApiToken,
} from '@/hooks/data/api-tokens'
import { TOKEN_STATUS } from '@/lib/api-tokens'
import { parseSort, serializeSort } from '@/lib/pagination'

const route = getRouteApi('/_authenticated/api-tokens')

const PAGE_SIZE = 10

function sortValue(token: ApiTokenRepresentation, columnId: string): string {
  if (columnId === 'user') return token.linkedUser?.name ?? ''
  if (columnId === 'description') return token.description ?? ''
  return ''
}

function matchesSearch(
  token: ApiTokenRepresentation,
  searchInput: string,
): boolean {
  if (!searchInput) return true
  const searchedContent = [token.linkedUser?.name, token.description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return searchedContent.includes(searchInput.toLowerCase())
}

interface AllApiTokensViewProps {
  hideTitle?: boolean
}

export function AllApiTokensView({
  hideTitle = false,
}: AllApiTokensViewProps): React.ReactElement {
  const { t } = useTranslation()
  const { data: tokensByUser } = useFindAllAdminApiTokens()

  const revokeApiToken = useRevokeApiToken()
  const deleteApiToken = useDeleteApiToken()

  const { adminPage: page, adminSort, adminSearch } = route.useSearch()
  const navigate = route.useNavigate()

  const search = adminSearch ?? ''
  const sorting = parseSort(adminSort)

  const [tokenToRevoke, setTokenToRevoke] = useState<
    ApiTokenRepresentation | undefined
  >(undefined)
  const [tokenToDelete, setTokenToDelete] = useState<
    ApiTokenRepresentation | undefined
  >(undefined)

  const allTokens = Object.values(tokensByUser).flat()

  const filtered = allTokens.filter(token => matchesSearch(token, search))

  const sort = sorting[0]
  const sorted = sort
    ? [...filtered].sort((a, b) => {
        const cmp = sortValue(a, sort.id).localeCompare(sortValue(b, sort.id))
        return sort.desc ? -cmp : cmp
      })
    : filtered

  const totalElements = sorted.length
  const totalPages = Math.max(1, Math.ceil(totalElements / PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)
  const pageTokens = sorted.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  )

  function onSearchChange(value: string): void {
    void navigate({
      search: prev => ({
        ...prev,
        adminSearch: value || undefined,
        adminPage: 0,
      }),
    })
  }

  function onSortingChange(updater: Updater<SortingState>): void {
    const next = typeof updater === 'function' ? updater(sorting) : updater
    void navigate({
      search: prev => ({
        ...prev,
        adminSort: serializeSort(next),
        adminPage: 0,
      }),
    })
  }

  function goToPage(nextPage: number): void {
    void navigate({ search: prev => ({ ...prev, adminPage: nextPage }) })
  }

  function confirmRevoke(): void {
    if (!tokenToRevoke?.id) return
    revokeApiToken.mutate(
      {
        path: { id: tokenToRevoke.id as unknown as number },
        body: { status: TOKEN_STATUS.REVOKED },
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

  const hasTokens = allTokens.length > 0

  return (
    <div className="space-y-6">
      {!hideTitle && <PageHeader title={t('apiTokens.admin.title')} />}
      {hasTokens ? (
        <>
          <AllApiTokensFilterBar
            search={search}
            onSearchChange={onSearchChange}
          />
          <AllApiTokensTable
            tokens={pageTokens}
            page={safePage}
            totalPages={totalPages}
            totalElements={totalElements}
            sorting={sorting}
            onSortingChange={onSortingChange}
            onPreviousPage={() => goToPage(Math.max(0, safePage - 1))}
            onNextPage={() => goToPage(Math.min(totalPages - 1, safePage + 1))}
            onRevoke={setTokenToRevoke}
            onDelete={setTokenToDelete}
          />
        </>
      ) : (
        <EmptyState
          icon={RiKeyLine}
          title={t('apiTokens.admin.empty.title')}
          description={t('apiTokens.admin.empty.description')}
        />
      )}

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
        description={t('apiTokens.admin.deleteConfirm', {
          user: tokenToDelete?.linkedUser?.name ?? '',
        })}
        confirmLabel={t('common.delete')}
        onConfirm={confirmDelete}
        isPending={deleteApiToken.isPending}
      />
    </div>
  )
}
