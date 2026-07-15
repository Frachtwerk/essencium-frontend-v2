import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ProfileFormValues } from './profile-form-schema'

import { SsoManagedNotice } from '@/components/shared/sso-managed-notice'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SUPPORTED_LOCALES } from '@/lib/locale'
import { isSsoManaged } from '@/lib/sso'

interface ProfileFormProps {
  form: UseFormReturn<ProfileFormValues>
  onSubmit: (values: ProfileFormValues) => void
  isSubmitting?: boolean
  ssoProvider?: string
}

export function ProfileForm({
  form,
  onSubmit,
  isSubmitting,
  ssoProvider,
}: ProfileFormProps): React.ReactElement {
  const { t } = useTranslation()

  const isSso = isSsoManaged(ssoProvider)

  return (
    <Form {...form}>
      <form
        onSubmit={e => void form.handleSubmit(onSubmit)(e)}
        className="max-w-2xl space-y-6"
      >
        <SsoManagedNotice ssoProvider={ssoProvider} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('users.form.firstName')}</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSso} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('users.form.lastName')}</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSso} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.form.email')}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="off"
                  {...field}
                  disabled={isSso}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('users.form.phone')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('users.form.mobile')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="locale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.form.locale')}</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LOCALES.map(locale => (
                      <SelectItem key={locale} value={locale}>
                        {locale.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('common.saving') : t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
