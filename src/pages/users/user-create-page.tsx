import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { UserForm } from './user-form'
import type { UserFormValues } from './user-form-schema'

import { PageHeader } from '@/components/layout/page-header'
import type { UserDtoWritable } from '@/generated/client/types.gen'
import { useCreateUser } from '@/hooks/data/users'

export function UserCreatePage(): React.ReactElement {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const createUser = useCreateUser()

  function handleSubmit(values: UserFormValues): void {
    const body: UserDtoWritable = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      locale: values.locale,
      roles: values.roles,
      enabled: values.enabled,
      phone: values.phone || undefined,
      mobile: values.mobile || undefined,
      password: values.password ? values.password : undefined,
    }
    createUser.mutate(
      { body },
      {
        onSuccess: () => {
          toast.success(t('users.createSuccess'))
          void navigate({ to: '/users' })
        },
        onError: () => toast.error(t('users.saveError')),
      },
    )
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader title={t('users.createTitle')} />
      <UserForm
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={createUser.isPending}
      />
    </div>
  )
}
