import {
  RiAddLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiDeleteBinLine,
  RiEditLine,
} from '@remixicon/react'
import { getRouteApi } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { RoleFormDialog } from './role-form-dialog'

import { DataTable } from '@/components/data-table'
import { PageHeader } from '@/components/layout/page-header'
import { CanAccess } from '@/components/shared/can-access'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import type { Role } from '@/generated/client/types.gen'
import { useDeleteRole, useFindAllRoles } from '@/hooks/data/roles'
import { RIGHTS } from '@/lib/permissions'

const route = getRouteApi('/_authenticated/roles')

export function RolesListPage(): React.ReactElement {
  const { t } = useTranslation()
  const { page, size } = route.useSearch()
  const { data: rolesPage } = useFindAllRoles({
    page,
    size,
    sort: ['name,asc'],
  })
  const deleteRole = useDeleteRole()

  const [formOpen, setFormOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | undefined>(undefined)
  const [roleToDelete, setRoleToDelete] = useState<Role | undefined>(undefined)

  function openCreate(): void {
    setEditingRole(undefined)
    setFormOpen(true)
  }

  function openEdit(role: Role): void {
    setEditingRole(role)
    setFormOpen(true)
  }

  function confirmDelete(): void {
    if (!roleToDelete) return
    deleteRole.mutate(
      { path: { name: roleToDelete.name } },
      {
        onSuccess: () => {
          toast.success(t('roles.deleteSuccess'))
          setRoleToDelete(undefined)
        },
        onError: () => toast.error(t('roles.deleteError')),
      },
    )
  }

  const columns: ColumnDef<Role>[] = [
    { accessorKey: 'name', header: t('roles.table.name') },
    {
      accessorKey: 'description',
      header: t('roles.table.description'),
      cell: ({ row }) => row.original.description || '—',
    },
    {
      id: 'rights',
      header: t('roles.table.rights'),
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
      id: 'actions',
      header: () => <span className="sr-only">{t('roles.table.actions')}</span>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <CanAccess rights={RIGHTS.RIGHT_UPDATE}>
            {row.original.editable !== false && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('common.edit')}
                onClick={() => openEdit(row.original)}
              >
                <RiEditLine className="size-4" />
              </Button>
            )}
          </CanAccess>
          <CanAccess rights={RIGHTS.ROLE_DELETE}>
            {row.original.protected !== true && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('common.delete')}
                onClick={() => setRoleToDelete(row.original)}
              >
                <RiDeleteBinLine className="text-destructive-400 size-4" />
              </Button>
            )}
          </CanAccess>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={t('roles.title')}
        actions={
          <CanAccess rights={RIGHTS.ROLE_CREATE}>
            <Button onClick={openCreate}>
              <RiAddLine className="size-4" />
              {t('roles.create')}
            </Button>
          </CanAccess>
        }
      />
      <DataTable
        columns={columns}
        data={rolesPage.content ?? []}
        currentPage={page}
        totalPages={rolesPage.totalPages ?? 0}
        totalElements={rolesPage.totalElements ?? 0}
        renderPreviousPageButton={({ disabled }) => (
          <LinkButton
            variant="outline"
            size="sm"
            disabled={disabled}
            to="/roles"
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
            to="/roles"
            search={{
              page: Math.min((rolesPage.totalPages ?? 1) - 1, page + 1),
              size,
            }}
          >
            <RiArrowRightSLine className="size-4" />
          </LinkButton>
        )}
      />

      <RoleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        role={editingRole}
      />

      <AlertDialog
        open={roleToDelete !== undefined}
        onOpenChange={isOpen => {
          if (!isOpen) setRoleToDelete(undefined)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('roles.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('roles.deleteConfirm', { name: roleToDelete?.name ?? '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteRole.isPending}
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
