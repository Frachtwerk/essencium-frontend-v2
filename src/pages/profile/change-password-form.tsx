import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ChangePasswordFormValues } from './profile-form-schema'

import { PasswordChecklist } from '@/components/password-checklist'
import { PasswordInput } from '@/components/password-input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface ChangePasswordFormProps {
  form: UseFormReturn<ChangePasswordFormValues>
  onSubmit: (values: ChangePasswordFormValues) => void
  isSubmitting?: boolean
}

export function ChangePasswordForm({
  form,
  onSubmit,
  isSubmitting,
}: ChangePasswordFormProps): React.ReactElement {
  const { t } = useTranslation()

  return (
    <Form {...form}>
      <form
        onSubmit={e => void form.handleSubmit(onSubmit)(e)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('profile.tabs.changePassword.form.currentPassword')}
                </FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('profile.tabs.changePassword.form.newPassword')}
                </FormLabel>

                <PasswordChecklist value={field.value}>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" {...field} />
                  </FormControl>
                </PasswordChecklist>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('profile.tabs.changePassword.form.passwordConfirmation')}
                </FormLabel>

                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('common.saving') : t('common.save')}
        </Button>
      </form>
    </Form>
  )
}
