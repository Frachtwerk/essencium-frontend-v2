import {
  RiAddLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from '@remixicon/react'
import { getRouteApi } from '@tanstack/react-router'
import type { ColumnDef, SortingState, Updater } from '@tanstack/react-table'
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
import { isDefaultUser } from '@/lib/default-user'
import { parseSort, serializeSort } from '@/lib/pagination'
import { RIGHTS } from '@/lib/permissions'
import { cn } from '@/lib/utils'

const route = getRouteApi('/_authenticated/users/')

export function UsersListPage(): React.ReactElement {
  const { t } = useTranslation()
  const { page, size, name, email, roles, sort } = route.useSearch()
  const { data: usersPage } = useFindAllUsers({
    page,
    size,
    sort: [sort],
    name,
    email,
    roles,
  })
  const navigate = route.useNavigate()

  const sorting = parseSort(sort)

  function onSortingChange(updater: Updater<SortingState>): void {
    const next = typeof updater === 'function' ? updater(sorting) : updater
    void navigate({
      search: prev => ({
        ...prev,
        sort: serializeSort(next) ?? 'email,asc',
        page: 0,
      }),
    })
  }

  const columns: ColumnDef<UserRepresentation>[] = [
    {
      id: 'name',
      header: t('users.table.name'),
      enableSorting: true,
      cell: ({ row }) =>
        [row.original.firstName, row.original.lastName]
          .filter(Boolean)
          .join(' ') || '—',
    },
    {
      accessorKey: 'email',
      header: t('users.table.email'),
      enableSorting: true,
    },
    {
      accessorKey: 'phone',
      header: t('users.table.phone'),
      enableSorting: true,
      cell: ({ row }) => row.original.phone || '—',
    },
    {
      id: 'roles',
      header: t('users.table.roles'),
      enableSorting: false,
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
      enableSorting: true,
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
      enableSorting: false,
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
        sorting={sorting}
        onSortingChange={onSortingChange}
        onRowClick={row =>
          void navigate({
            to: '/users/$userId',
            params: { userId: String(row.original.id) },
          })
        }
        isRowClickable={row => !isDefaultUser(row.original.email)}
        renderPreviousPageButton={({ disabled }) => (
          <LinkButton
            variant="outline"
            size="sm"
            disabled={disabled}
            to="/users"
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
            to="/users"
            search={prev => ({
              ...prev,
              page: Math.min((usersPage.totalPages ?? 1) - 1, page + 1),
              size,
            })}
          >
            <RiArrowRightSLine className="size-4" />
          </LinkButton>
        )}
      />
    </div>
  )
}
