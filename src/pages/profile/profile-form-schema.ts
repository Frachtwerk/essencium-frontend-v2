import z from 'zod'

import { passwordSchema, userFormSchema } from '../users/user-form-schema'

import { SUPPORTED_LOCALES } from '@/lib/locale'

export const profileFormSchema = userFormSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  mobile: true,
  locale: true,
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

export const defaultProfileFormValues: ProfileFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  mobile: '',
  locale: SUPPORTED_LOCALES[0],
}

export const changePasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'profile.tabs.changePassword.form.currentPasswordRequired'),
    newPassword: passwordSchema,
    passwordConfirmation: z.string(),
  })
  .refine(data => data.newPassword === data.passwordConfirmation, {
    error: 'profile.tabs.changePassword.form.noMatch',
    path: ['passwordConfirmation'],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>

export const defaultChangePasswordFormValues: ChangePasswordFormValues = {
  currentPassword: '',
  newPassword: '',
  passwordConfirmation: '',
}
