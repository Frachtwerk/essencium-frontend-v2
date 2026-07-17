import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ChangePasswordFormValues } from './profile-form-schema'

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
        className="max-w-2xl space-y-6"
      >
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

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('profile.tabs.changePassword.form.newPassword')}
              </FormLabel>
              <FormControl>
                <PasswordInput autoComplete="new-password" {...field} />
              </FormControl>
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

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('common.saving') : t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
