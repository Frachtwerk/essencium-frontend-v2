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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ApiTokenRepresentation } from '@/generated/client/types.gen'
import { TOKEN_STATUS, TOKEN_STATUS_BADGE_VARIANT } from '@/lib/api-tokens'

interface AllApiTokensTableProps {
  tokens: ApiTokenRepresentation[]
  page: number
  totalPages: number
  totalElements: number
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  onPreviousPage: () => void
  onNextPage: () => void
  onRevoke: (token: ApiTokenRepresentation) => void
  onDelete: (token: ApiTokenRepresentation) => void
}

export function AllApiTokensTable({
  tokens,
  page,
  totalPages,
  totalElements,
  sorting,
  onSortingChange,
  onPreviousPage,
  onNextPage,
  onRevoke,
  onDelete,
}: AllApiTokensTableProps): React.ReactElement {
  const { t } = useTranslation()

  const columns: ColumnDef<ApiTokenRepresentation>[] = [
    {
      id: 'user',
      header: t('apiTokens.admin.table.user'),
      accessorFn: row => row.linkedUser?.name ?? '',
      enableSorting: true,
      cell: ({ row }) => row.original.linkedUser?.name || '—',
    },
    {
      accessorKey: 'description',
      header: t('apiTokens.table.description'),
      enableSorting: true,
      cell: ({ row }) => row.original.description || '—',
    },
    {
      id: 'status',
      header: t('apiTokens.table.status'),
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
      id: 'actions',
      header: () => (
        <span className="sr-only">{t('apiTokens.table.actions')}</span>
      ),
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            disabled={row.original.status !== TOKEN_STATUS.ACTIVE}
            aria-label={t('apiTokens.revoke')}
            onClick={() => onRevoke(row.original)}
          >
            <RiForbidLine className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label={t('common.delete')}
            onClick={() => onDelete(row.original)}
          >
            <RiDeleteBinLine className="text-destructive-400 size-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={tokens}
      currentPage={page}
      totalPages={totalPages}
      totalElements={totalElements}
      sorting={sorting}
      onSortingChange={onSortingChange}
      renderPreviousPageButton={({ disabled }) => (
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={onPreviousPage}
          aria-label={t('common.previousPage')}
        >
          <RiArrowLeftSLine className="size-4" />
        </Button>
      )}
      renderNextPageButton={({ disabled }) => (
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={onNextPage}
          aria-label={t('common.nextPage')}
        >
          <RiArrowRightSLine className="size-4" />
        </Button>
      )}
    />
  )
}
