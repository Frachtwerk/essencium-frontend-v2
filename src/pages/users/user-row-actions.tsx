import {
  RiDeleteBinLine,
  RiEditLine,
  RiLogoutBoxRLine,
  RiMore2Line,
} from '@remixicon/react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

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
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { UserRepresentation } from '@/generated/client/types.gen'
import { useDeleteUser, useTerminateUser } from '@/hooks/data/users'
import { useCurrentUser } from '@/hooks/use-current-user'
import { isDefaultUser } from '@/lib/default-user'
import { RIGHTS } from '@/lib/permissions'

interface UserRowActionsProps {
  user: UserRepresentation
}

export function UserRowActions({
  user,
}: UserRowActionsProps): React.ReactElement {
  const { t } = useTranslation()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [terminateOpen, setTerminateOpen] = useState(false)
  const deleteUser = useDeleteUser()
  const terminateUser = useTerminateUser()
  const { data: currentUser } = useCurrentUser()

  const isDefault = isDefaultUser(user.email)
  const isSelf = user.id !== undefined && user.id === currentUser.id
  const terminateDisabled = isDefault || isSelf

  function handleDelete(): void {
    if (user.id === undefined) return
    deleteUser.mutate(
      { path: { id: String(user.id) } },
      {
        onSuccess: () => {
          toast.success(t('users.deleteSuccess'))
          setDeleteOpen(false)
        },
        onError: () => toast.error(t('users.deleteError')),
      },
    )
  }

  function handleTerminate(): void {
    if (user.id === undefined) return
    terminateUser.mutate(
      { path: { id: String(user.id) } },
      {
        onSuccess: () => {
          toast.success(t('users.terminateSuccess'))
          setTerminateOpen(false)
        },
        onError: () => toast.error(t('users.terminateError')),
      },
    )
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('users.table.actions')}
              onClick={e => e.stopPropagation()}
            />
          }
        >
          <RiMore2Line className="size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
          <CanAccess rights={RIGHTS.USER_UPDATE}>
            <DropdownMenuItem
              disabled={isDefault}
              {...(isDefault
                ? {}
                : {
                    render: (
                      <Link
                        to="/users/$userId"
                        params={{ userId: String(user.id) }}
                      />
                    ),
                  })}
            >
              <RiEditLine />
              {t('common.edit')}
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={terminateDisabled}
              onClick={() => setTerminateOpen(true)}
            >
              <RiLogoutBoxRLine />
              {t('users.terminate')}
            </DropdownMenuItem>
          </CanAccess>

          <CanAccess rights={RIGHTS.USER_DELETE}>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive-400"
              disabled={isDefault}
              onClick={() => setDeleteOpen(true)}
            >
              <RiDeleteBinLine />
              {t('common.delete')}
            </DropdownMenuItem>
          </CanAccess>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={terminateOpen} onOpenChange={setTerminateOpen}>
        <AlertDialogContent onClick={e => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('users.terminateTitle')}</AlertDialogTitle>

            <AlertDialogDescription>
              {t('users.terminateConfirm', { name: user.email ?? '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleTerminate}
              disabled={terminateUser.isPending}
            >
              {t('users.terminate')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent onClick={e => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('users.deleteTitle')}</AlertDialogTitle>

            <AlertDialogDescription>
              {t('users.deleteConfirm', { name: user.email ?? '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteUser.isPending}
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
