import { RiDeleteBinLine, RiEditLine } from '@remixicon/react'
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
import type { UserRepresentation } from '@/generated/client/types.gen'
import { useDeleteUser } from '@/hooks/data/users'
import { RIGHTS } from '@/lib/permissions'

interface UserRowActionsProps {
  user: UserRepresentation
}

/** Edit + delete actions for a user row, with a delete confirmation dialog. */
export function UserRowActions({
  user,
}: UserRowActionsProps): React.ReactElement {
  const { t } = useTranslation()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const deleteUser = useDeleteUser()

  function handleDelete(): void {
    if (user.id === undefined) return
    deleteUser.mutate(
      { path: { id: String(user.id) } },
      {
        onSuccess: () => {
          toast.success(t('users.deleteSuccess'))
          setConfirmOpen(false)
        },
        onError: () => toast.error(t('users.deleteError')),
      },
    )
  }

  return (
    <div className="flex justify-end gap-1">
      <CanAccess rights={RIGHTS.USER_UPDATE}>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('common.edit')}
          render={
            <Link to="/users/$userId" params={{ userId: String(user.id) }} />
          }
        >
          <RiEditLine className="size-4" />
        </Button>
      </CanAccess>
      <CanAccess rights={RIGHTS.USER_DELETE}>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('common.delete')}
          onClick={e => {
            // Don't trigger the row's click-to-edit navigation.
            e.stopPropagation()
            setConfirmOpen(true)
          }}
        >
          <RiDeleteBinLine className="text-destructive-400 size-4" />
        </Button>
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('users.deleteTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('users.deleteConfirm', {
                  name: user.email ?? '',
                })}
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
      </CanAccess>
    </div>
  )
}
