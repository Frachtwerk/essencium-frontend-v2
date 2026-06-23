import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import {
  defaultRoleFormValues,
  roleFormSchema,
  type RoleFormValues,
} from './role-form-schema'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Role, RoleDto } from '@/generated/client/types.gen'
import { useAllRights } from '@/hooks/data/rights'
import { useCreateRole, useUpdateRole } from '@/hooks/data/roles'
import { zodFormResolver } from '@/lib/zod-resolver'

interface RoleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** When set, the dialog edits this role; otherwise it creates a new one. */
  role?: Role
}

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
}: RoleFormDialogProps): React.ReactElement {
  const { t } = useTranslation()
  const isEdit = role !== undefined
  const { data: rightsPage } = useAllRights()
  const rights = rightsPage.content ?? []

  const createRole = useCreateRole()
  const updateRole = useUpdateRole()
  const isSubmitting = createRole.isPending || updateRole.isPending

  const form = useForm<RoleFormValues>({
    resolver: zodFormResolver(roleFormSchema),
    values: role
      ? {
          name: role.name,
          description: role.description ?? '',
          rights: (role.rights ?? []).map(r => r.authority),
        }
      : defaultRoleFormValues,
  })

  function handleSubmit(values: RoleFormValues): void {
    const body: RoleDto = {
      name: values.name,
      description: values.description || undefined,
      rights: values.rights,
    }
    const callbacks = {
      onSuccess: () => {
        toast.success(
          role ? t('roles.updateSuccess') : t('roles.createSuccess'),
        )
        onOpenChange(false)
      },
      onError: () => toast.error(t('roles.saveError')),
    }
    if (role) {
      updateRole.mutate({ path: { name: role.name }, body }, callbacks)
    } else {
      createRole.mutate({ body }, callbacks)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('roles.editTitle') : t('roles.createTitle')}
          </DialogTitle>
          <DialogDescription>{t('roles.formDescription')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={e => void form.handleSubmit(handleSubmit)(e)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('roles.form.name')}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isEdit} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('roles.form.description')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rights"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('roles.form.rights')}</FormLabel>
                  <div className="grid max-h-56 gap-2 overflow-y-auto rounded-md border p-3 sm:grid-cols-2">
                    {rights.map(right => (
                      <Label
                        key={right.authority}
                        className="flex items-center gap-2 font-normal"
                      >
                        <Checkbox
                          checked={field.value.includes(right.authority)}
                          onCheckedChange={isChecked => {
                            field.onChange(
                              isChecked
                                ? [...field.value, right.authority]
                                : field.value.filter(
                                    r => r !== right.authority,
                                  ),
                            )
                          }}
                        />
                        {right.authority}
                      </Label>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('common.saving') : t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
