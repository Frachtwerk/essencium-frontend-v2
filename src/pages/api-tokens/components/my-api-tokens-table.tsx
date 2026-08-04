import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiDeleteBinLine,
  RiForbidLine,
} from '@remixicon/react'
import type { ColumnDef, OnChangeFn, SortingState } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { ApiTokenRightsBadges } from './api-token-rights-badges'

import { DataTable } from '@/components/data-table'
import { CanAccess } from '@/components/shared/can-access'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import type {
  ApiTokenRepresentation,
  PageApiTokenRepresentation,
} from '@/generated/client/types.gen'
import { TOKEN_STATUS, TOKEN_STATUS_BADGE_VARIANT } from '@/lib/api-tokens'
import { RIGHTS } from '@/lib/permissions'

interface MyApiTokensTableProps {
  tokensPage: PageApiTokenRepresentation
  page: number
  size: number
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  onRevoke: (token: ApiTokenRepresentation) => void
  onDelete: (token: ApiTokenRepresentation) => void
}

export function MyApiTokensTable({
  tokensPage,
  page,
  size,
  sorting,
  onSortingChange,
  onRevoke,
  onDelete,
}: MyApiTokensTableProps): React.ReactElement {
  const { t } = useTranslation()

  const columns: ColumnDef<ApiTokenRepresentation>[] = [
    {
      accessorKey: 'description',
      header: t('apiTokens.table.description'),
      enableSorting: true,
      cell: ({ row }) => row.original.description || '—',
    },
    {
      id: 'status',
      header: t('apiTokens.table.status'),
      enableSorting: true,
      cell: ({ row }) => {
        const status = row.original.status
        if (!status) return '—'
        return (
          <Badge variant={TOKEN_STATUS_BADGE_VARIANT[status]}>
            {t(`apiTokens.status.${status}`)}
          </Badge>
        )
      },
    },
    {
      id: 'validUntil',
      header: t('apiTokens.table.validUntil'),
      enableSorting: true,
      cell: ({ row }) =>
        row.original.validUntil
          ? dayjs(row.original.validUntil).format('L')
          : '—',
    },
    {
      id: 'rights',
      header: t('apiTokens.table.rights'),
      cell: ({ row }) => <ApiTokenRightsBadges rights={row.original.rights} />,
    },
    {
      id: 'createdAt',
      header: t('apiTokens.table.createdAt'),
      enableSorting: true,
      cell: ({ row }) =>
        row.original.createdAt
          ? dayjs(row.original.createdAt).format('L LT')
          : '—',
    },
    {
      id: 'actions',
      header: () => (
        <span className="sr-only">{t('apiTokens.table.actions')}</span>
      ),
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('apiTokens.revoke')}
            onClick={() => onRevoke(row.original)}
            disabled={row.original.status !== TOKEN_STATUS.ACTIVE}
          >
            <RiForbidLine className="size-4" />
          </Button>

          <CanAccess rights={RIGHTS.API_TOKEN_ADMIN}>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('common.delete')}
              onClick={() => onDelete(row.original)}
            >
              <RiDeleteBinLine className="text-destructive-400 size-4" />
            </Button>
          </CanAccess>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={tokensPage.content ?? []}
      currentPage={page}
      totalPages={tokensPage.totalPages ?? 0}
      totalElements={tokensPage.totalElements ?? 0}
      sorting={sorting}
      onSortingChange={onSortingChange}
      renderPreviousPageButton={({ disabled }) => (
        <LinkButton
          variant="outline"
          size="sm"
          disabled={disabled}
          to="/api-tokens"
          search={prev => ({ ...prev, page: Math.max(0, page - 1), size })}
        >
          <RiArrowLeftSLine className="size-4" />
        </LinkButton>
      )}
      renderNextPageButton={({ disabled }) => (
        <LinkButton
          variant="outline"
          size="sm"
          disabled={disabled}
          to="/api-tokens"
          search={prev => ({
            ...prev,
            page: Math.min((tokensPage.totalPages ?? 1) - 1, page + 1),
            size,
          })}
        >
          <RiArrowRightSLine className="size-4" />
        </LinkButton>
      )}
    />
  )
}
