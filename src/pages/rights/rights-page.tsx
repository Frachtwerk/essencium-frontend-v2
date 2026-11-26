import { getRouteApi } from '@tanstack/react-router'
import type { SortingState, Updater } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { DataTable, type DataTableColumnDef } from '@/components/data-table'
import { PageHeader } from '@/components/layout/page-header'
import { PageWrapper } from '@/components/layout/page-wrapper'
import { Checkbox } from '@/components/ui/checkbox'
import { Right } from '@/generated/client'
import { useFindAllRights } from '@/hooks/data/rights'
import { useAllRoles, useToggleRoleRight } from '@/hooks/data/roles'
import { usePermissions } from '@/hooks/use-permissions'
import { parseSort, serializeSort } from '@/lib/pagination'
import { RIGHTS } from '@/lib/permissions'
import { isRoleLocked } from '@/lib/roles'
import { cn } from '@/lib/utils'

const route = getRouteApi('/_authenticated/rights')

interface RoleRightCheckboxProps {
  roleName: string
  authority: string
  checked: boolean
  disabled: boolean
}

/**
 * One cell of the matrix. The mutation lives per role so concurrent toggles on
 * the same role are serialized, and the checkbox reflects the optimistic cache
 * state immediately.
 */
function RoleRightCheckbox({
  roleName,
  authority,
  checked,
  disabled,
}: RoleRightCheckboxProps): React.ReactElement {
  const { t } = useTranslation()
  const { mutate: toggleRight } = useToggleRoleRight(roleName, {
    onSuccess: () =>
      toast.success(t('rights.updateSuccess', { name: roleName })),
    onError: () => toast.error(t('rights.updateError', { name: roleName })),
  })

  return (
    <Checkbox
      checked={checked}
      disabled={disabled}
      aria-label={t('rights.checkbox', { right: authority, role: roleName })}
      onCheckedChange={nextChecked => toggleRight({ authority, nextChecked })}
    />
  )
}

export function RightsPage(): React.ReactElement {
  const { t } = useTranslation()
  const { page, size, sort } = route.useSearch()
  const navigate = route.useNavigate()

  const { data: allRights } = useFindAllRights({
    page,
    size,
    sort: sort ? [sort] : undefined,
  })

  const { data: allRoles } = useAllRoles()
  const canUpdateRoles = usePermissions().can(RIGHTS.ROLE_UPDATE)

  const roleRightSets = new Map(
    allRoles?.content?.map(role => [
      role.id,
      new Set(role?.rights?.map(r => r.authority)),
    ]),
  )

  const roleColumns: DataTableColumnDef<Right>[] =
    allRoles.content?.map(role => ({
      id: role.id ?? role.name,
      header: () => (
        <span className={cn(isRoleLocked(role) && 'text-muted-foreground')}>
          {role.name}
        </span>
      ),
      cell: row => (
        <RoleRightCheckbox
          roleName={role.name}
          authority={row.row.original.authority}
          checked={
            roleRightSets.get(role.id)?.has(row.row.original.authority) ?? false
          }
          disabled={!canUpdateRoles || isRoleLocked(role)}
        />
      ),
      enableSorting: false,
    })) || []

  const columns: DataTableColumnDef<Right>[] = [
    {
      accessorKey: 'authority',
      header: t('rights.authority'),
      cell: info => info.getValue(),
      enableSorting: true,
      enablePinning: true,
    },
    ...roleColumns,
  ]

  const sorting = parseSort(sort)

  function onSortingChange(updater: Updater<SortingState>): void {
    const next = typeof updater === 'function' ? updater(sorting) : updater

    void navigate({
      search: prev => ({
        ...prev,
        sort: serializeSort(next),
        page: 0,
      }),
    })
  }

  return (
    <PageWrapper className="space-y-6">
      <PageHeader title={t('rights.title')} />
      <DataTable
        columns={columns}
        data={allRights.content ?? []}
        getRowId={right => right.authority}
        currentPage={page}
        totalPages={allRights.totalPages ?? 0}
        totalElements={allRights.totalElements ?? 0}
        onSortingChange={onSortingChange}
        sorting={sorting}
        pinnedColumns={['authority']}
        pageSize={size}
        onPageChange={nextPage =>
          void navigate({ search: prev => ({ ...prev, page: nextPage }) })
        }
        onPageSizeChange={nextSize =>
          void navigate({
            search: prev => ({ ...prev, size: nextSize, page: 0 }),
          })
        }
      />
    </PageWrapper>
  )
}
