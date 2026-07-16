import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { ProfileForm } from './profile-form'
import {
  defaultProfileFormValues,
  profileFormSchema,
  ProfileFormValues,
} from './profile-form-schema'

import { PageHeader } from '@/components/layout/page-header'
import { useGetMe, useUpdateMePartial } from '@/hooks/data/me'
import { toSupportedLocale } from '@/lib/locale'
import { zodFormResolver } from '@/lib/zod-resolver'

export function ProfilePage(): React.ReactElement {
  const { t } = useTranslation()

  const { data: currentUser } = useGetMe()
  const { mutate: updateCurrentUser, isPending } = useUpdateMePartial()

  const initialValues: ProfileFormValues = {
    ...defaultProfileFormValues,
    firstName: currentUser.firstName ?? '',
    lastName: currentUser.lastName ?? '',
    email: currentUser.email ?? '',
    phone: currentUser.phone ?? '',
    mobile: currentUser.mobile ?? '',
    locale: toSupportedLocale(currentUser.locale),
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodFormResolver(profileFormSchema),
    defaultValues: initialValues,
  })

  const { dirtyFields } = form.formState

  function handleSubmit(values: ProfileFormValues): void {
    const changedValues = Object.fromEntries(
      (Object.keys(dirtyFields) as Array<keyof ProfileFormValues>)
        .filter(field => dirtyFields[field])
        .map(field => [field, values[field]]),
    ) as Partial<ProfileFormValues>

    if (Object.keys(changedValues).length === 0) return

    updateCurrentUser(
      { body: changedValues },
      {
        onSuccess: () => {
          toast.success(t('profile.updateSuccess'))
          form.reset(values)
        },
        onError: () => toast.error(t('profile.saveError')),
      },
    )
  }

  return (
    <div className="p-6">
      <PageHeader title={t('profile.title')} />
      <ProfileForm
        form={form}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        ssoProvider={currentUser.source}
      />
    </div>
  )
}
