import {
  RiAddLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from '@remixicon/react'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { UserRowActions } from './user-row-actions'
import { UsersFilterBar } from './users-filter-bar'

import { DataTable } from '@/components/data-table'
import { PageHeader } from '@/components/layout/page-header'
import { CanAccess } from '@/components/shared/can-access'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import type { UserRepresentation } from '@/generated/client/types.gen'
import { useFindAllUsers } from '@/hooks/data/users'
import { RIGHTS } from '@/lib/permissions'
import { cn } from '@/lib/utils'

const route = getRouteApi('/_authenticated/users/')

export function UsersListPage(): React.ReactElement {
  const { t } = useTranslation()
  const { page, size, name, email, roles } = route.useSearch()
  const { data: usersPage } = useFindAllUsers({
    page,
    size,
    sort: ['email,asc'],
    name,
    email,
    roles,
  })
  const navigate = useNavigate()

  const columns: ColumnDef<UserRepresentation>[] = [
    {
      id: 'name',
      header: t('users.table.name'),
      cell: ({ row }) =>
        [row.original.firstName, row.original.lastName]
          .filter(Boolean)
          .join(' ') || '—',
    },
    { accessorKey: 'email', header: t('users.table.email') },
    {
      accessorKey: 'phone',
      header: t('users.table.phone'),
      cell: ({ row }) => row.original.phone || '—',
    },
    {
      id: 'roles',
      header: t('users.table.roles'),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {(row.original.roles ?? []).map(r => (
            <Badge key={r.name} variant="secondary">
              {r.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: 'enabled',
      header: t('users.table.status'),
      cell: ({ row }) => (
        <Badge variant={row.original.enabled ? 'default' : 'outline'}>
          {row.original.enabled
            ? t('users.status.active')
            : t('users.status.inactive')}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">{t('users.table.actions')}</span>,
      cell: ({ row }) => <UserRowActions user={row.original} />,
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={t('users.title')}
        actions={
          <CanAccess rights={RIGHTS.USER_CREATE}>
            <LinkButton to="/users/new" className={cn(buttonVariants())}>
              <RiAddLine className="size-4" />
              {t('users.create')}
            </LinkButton>
          </CanAccess>
        }
      />
      <UsersFilterBar />
      <DataTable
        columns={columns}
        data={usersPage.content ?? []}
        currentPage={page}
        totalPages={usersPage.totalPages ?? 0}
        totalElements={usersPage.totalElements ?? 0}
        onRowClick={row =>
          void navigate({
            to: '/users/$userId',
            params: { userId: String(row.original.id) },
          })
        }
        renderPreviousPageButton={({ disabled }) => (
          <LinkButton
            variant="outline"
            size="sm"
            disabled={disabled}
            to="/users"
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
            to="/users"
            search={{
              page: Math.min((usersPage.totalPages ?? 1) - 1, page + 1),
              size,
            }}
          >
            <RiArrowRightSLine className="size-4" />
          </LinkButton>
        )}
      />
    </div>
  )
}
