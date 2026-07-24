import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiDeleteBinLine,
  RiForbidLine,
} from '@remixicon/react'
import type { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { DataTable } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import type {
  ApiTokenRepresentation,
  PageApiTokenRepresentation,
} from '@/generated/client/types.gen'

const STATUS_BADGE_VARIANT: Record<
  NonNullable<ApiTokenRepresentation['status']>,
  'default' | 'secondary' | 'outline'
> = {
  ACTIVE: 'default',
  REVOKED: 'outline',
  REVOKED_ROLE_CHANGED: 'outline',
  REVOKED_RIGHTS_CHANGED: 'outline',
  REVOKED_USER_CHANGED: 'outline',
  EXPIRED: 'outline',
  USER_DELETED: 'outline',
}

interface ApiTokensTableProps {
  tokensPage: PageApiTokenRepresentation
  page: number
  size: number
  onRevoke: (token: ApiTokenRepresentation) => void
  onDelete: (token: ApiTokenRepresentation) => void
}

export function ApiTokensTable({
  tokensPage,
  page,
  size,
  onRevoke,
  onDelete,
}: ApiTokensTableProps): React.ReactElement {
  const { t } = useTranslation()

  const columns: ColumnDef<ApiTokenRepresentation>[] = [
    {
      accessorKey: 'description',
      header: t('apiTokens.table.description'),
      cell: ({ row }) => row.original.description || '—',
    },
    {
      id: 'status',
      header: t('apiTokens.table.status'),
      cell: ({ row }) => {
        const status = row.original.status
        if (!status) return '—'
        return (
          <Badge variant={STATUS_BADGE_VARIANT[status]}>
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
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {(row.original.rights ?? []).slice(0, 4).map(r => (
            <Badge key={r.authority} variant="secondary">
              {r.authority}
            </Badge>
          ))}
          {(row.original.rights ?? []).length > 4 && (
            <Badge variant="outline">
              +{(row.original.rights ?? []).length - 4}
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: 'createdAt',
      header: t('apiTokens.table.createdAt'),
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
          {row.original.status === 'ACTIVE' && (
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('apiTokens.revoke')}
              onClick={() => onRevoke(row.original)}
            >
              <RiForbidLine className="size-4" />
            </Button>
          )}
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
      data={tokensPage.content ?? []}
      currentPage={page}
      totalPages={tokensPage.totalPages ?? 0}
      totalElements={tokensPage.totalElements ?? 0}
      renderPreviousPageButton={({ disabled }) => (
        <LinkButton
          variant="outline"
          size="sm"
          disabled={disabled}
          to="/api-tokens"
          search={{ page: Math.max(0, page - 1), size }}
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
          search={{
            page: Math.min((tokensPage.totalPages ?? 1) - 1, page + 1),
            size,
          }}
        >
          <RiArrowRightSLine className="size-4" />
        </LinkButton>
      )}
    />
  )
}
