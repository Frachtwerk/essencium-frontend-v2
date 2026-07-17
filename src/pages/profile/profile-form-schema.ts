import z from 'zod'

import { userFormSchema } from '../users/user-form-schema'

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
