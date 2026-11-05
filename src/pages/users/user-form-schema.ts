import { z } from 'zod'

import { SUPPORTED_LOCALES } from '@/lib/locale'
import { passwordRules } from '@/lib/password-rules'

/**
 * User create/edit form schema. Password is optional: on create an empty
 * password makes the backend send a "set password" email; on edit an empty
 * password leaves it unchanged.
 */

export const passwordSchema = z.string().superRefine((value, ctx) => {
  for (const { key, test } of passwordRules) {
    if (!test(value)) {
      ctx.addIssue({
        code: 'custom',
        message: `users.validation.password.${key}`,
      })
    }
  }
})

export const userFormSchema = z.object({
  firstName: z.string().min(2, 'users.validation.firstName'),
  lastName: z.string().min(2, 'users.validation.lastName'),
  email: z.email('users.validation.email'),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  password: passwordSchema.optional().or(z.literal('')),
  locale: z.enum(SUPPORTED_LOCALES),
  enabled: z.boolean(),
  roles: z.array(z.string()).min(1, 'users.validation.roles'),
})

export type UserFormValues = z.infer<typeof userFormSchema>

export const defaultUserFormValues: UserFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  mobile: '',
  password: '',
  locale: 'de',
  enabled: true,
  roles: [],
}
