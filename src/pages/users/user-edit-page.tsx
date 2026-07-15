import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { UserForm } from './user-form'
import type { UserFormValues } from './user-form-schema'

import { PageHeader } from '@/components/layout/page-header'
import type { UserDtoWritable } from '@/generated/client/types.gen'
import { useFindByIdUser, useUpdateUser } from '@/hooks/data/users'
import { SUPPORTED_LOCALES } from '@/lib/locale'

const route = getRouteApi('/_authenticated/users/$userId')

export function UserEditPage(): React.ReactElement {
  const { t } = useTranslation()
  const { userId } = route.useParams()
  const id = Number(userId)
  const navigate = useNavigate()
  const { data: user } = useFindByIdUser(id)
  const updateUser = useUpdateUser()

  const initialValues: UserFormValues = {
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
    mobile: user.mobile ?? '',
    password: '',
    locale: SUPPORTED_LOCALES.includes(
      user.locale as (typeof SUPPORTED_LOCALES)[number],
    )
      ? (user.locale as (typeof SUPPORTED_LOCALES)[number])
      : 'de',
    enabled: user.enabled ?? true,
    roles: (user.roles ?? []).map(r => r.name),
  }

  function handleSubmit(values: UserFormValues): void {
    const body: UserDtoWritable = {
      id,
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
    updateUser.mutate(
      { path: { id }, body },
      {
        onSuccess: () => {
          toast.success(t('users.updateSuccess'))
          void navigate({ to: '/users' })
        },
        onError: () => toast.error(t('users.saveError')),
      },
    )
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={t('users.editTitle')}
        description={user.email ?? undefined}
      />
      <UserForm
        mode="edit"
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isSubmitting={updateUser.isPending}
        ssoProvider={user.source}
      />
    </div>
  )
}
