import dayjs from 'dayjs'
import { z } from 'zod'

// Same format as the date input, so the two compare as plain strings.
export function getTodayIsoDate(): string {
  return dayjs().format('YYYY-MM-DD')
}

export const apiTokenFormSchema = z.object({
  description: z.string().min(1, 'apiTokens.validation.description'),
  // The backend rejects dates before today with a 400; today itself is allowed.
  validUntil: z
    .string()
    .optional()
    .refine(
      value => !value || value >= getTodayIsoDate(),
      'apiTokens.validation.validUntilPast',
    ),
  rights: z.array(z.string()).min(1, 'apiTokens.validation.rights'),
})

export type ApiTokenFormValues = z.infer<typeof apiTokenFormSchema>

export const defaultApiTokenFormValues: ApiTokenFormValues = {
  description: '',
  validUntil: '',
  rights: [],
}
