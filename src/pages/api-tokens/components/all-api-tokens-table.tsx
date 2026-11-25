import { RiDeleteBinLine, RiForbidLine } from '@remixicon/react'
import type { OnChangeFn, SortingState } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { DataTable, type DataTableColumnDef } from '@/components/data-table'
import { RightsBadges } from '@/components/shared/rights-badges'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ApiTokenRepresentation } from '@/generated/client/types.gen'
import { TOKEN_STATUS, TOKEN_STATUS_BADGE_VARIANT } from '@/lib/api-tokens'

interface AllApiTokensTableProps {
  tokens: ApiTokenRepresentation[]
  page: number
  pageSize: number
  totalPages: number
  totalElements: number
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onRevoke: (token: ApiTokenRepresentation) => void
  onDelete: (token: ApiTokenRepresentation) => void
}

export function AllApiTokensTable({
  tokens,
  page,
  pageSize,
  totalPages,
  totalElements,
  sorting,
  onSortingChange,
  onPageChange,
  onPageSizeChange,
  onRevoke,
  onDelete,
}: AllApiTokensTableProps): React.ReactElement {
  const { t } = useTranslation()

  const columns: DataTableColumnDef<ApiTokenRepresentation>[] = [
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
      cell: ({ row }) => <RightsBadges rights={row.original.rights} />,
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
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
    />
  )
}
