import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { ChangePasswordForm } from './change-password-form'
import { ProfileForm } from './profile-form'
import {
  changePasswordFormSchema,
  ChangePasswordFormValues,
  defaultChangePasswordFormValues,
  defaultProfileFormValues,
  profileFormSchema,
  ProfileFormValues,
} from './profile-form-schema'

import { PageHeader } from '@/components/layout/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/context/auth-context'
import {
  useGetMe,
  useUpdateMePartial,
  useUpdateMePassword,
} from '@/hooks/data/me'
import { toSupportedLocale } from '@/lib/locale'
import { isSsoManaged } from '@/lib/sso'
import { zodFormResolver } from '@/lib/zod-resolver'

export function ProfilePage(): React.ReactElement {
  const { t } = useTranslation()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const { data: currentUser } = useGetMe()
  const { mutate: updateCurrentUser, isPending } = useUpdateMePartial()
  const { mutate: updateCurrentUserPassword, isPending: isPasswordPending } =
    useUpdateMePassword()

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

  const changePasswordForm = useForm<ChangePasswordFormValues>({
    resolver: zodFormResolver(changePasswordFormSchema),
    defaultValues: defaultChangePasswordFormValues,
  })

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

  function handleChangePasswordSubmit(values: ChangePasswordFormValues): void {
    updateCurrentUserPassword(
      {
        body: {
          password: values.newPassword,
          verification: values.currentPassword,
        },
      },
      {
        onSuccess: () => {
          toast.success(t('profile.tabs.changePassword.form.updateSuccess'))
          changePasswordForm.reset(defaultChangePasswordFormValues)
          void logout().then(() => navigate({ to: '/login' }))
        },
        onError: () =>
          toast.error(t('profile.tabs.changePassword.form.saveError')),
      },
    )
  }

  const tabs = {
    generalSettings: 'general-settings',
    changePassword: 'change-password',
  } as const

  const isSso = isSsoManaged(currentUser.source)

  return (
    <div className="p-6">
      <PageHeader title={t('profile.title')} />
      {isSso ? (
        <div className="w-[600px]">
          <ProfileForm
            form={form}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            ssoProvider={currentUser.source}
          />
        </div>
      ) : (
        <Tabs defaultValue={tabs.generalSettings} className="w-[600px]">
          <TabsList variant="line" className="mb-3.5">
            <TabsTrigger
              value={tabs.generalSettings}
              className="mr-1.5 w-[300px]"
            >
              {t('profile.tabs.generalSettings.title')}
            </TabsTrigger>
            <TabsTrigger value={tabs.changePassword}>
              {t('profile.tabs.changePassword.title')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value={tabs.generalSettings}>
            <ProfileForm
              form={form}
              onSubmit={handleSubmit}
              isSubmitting={isPending}
              ssoProvider={currentUser.source}
            />
          </TabsContent>
          <TabsContent value={tabs.changePassword}>
            <ChangePasswordForm
              form={changePasswordForm}
              onSubmit={handleChangePasswordSubmit}
              isSubmitting={isPasswordPending}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
