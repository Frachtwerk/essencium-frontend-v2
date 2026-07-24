import { z } from 'zod'

export const apiTokenFormSchema = z.object({
  description: z.string().min(1, 'apiTokens.validation.description'),
  validUntil: z.string().optional(),
  rights: z.array(z.string()).min(1, 'apiTokens.validation.rights'),
})

export type ApiTokenFormValues = z.infer<typeof apiTokenFormSchema>

export const defaultApiTokenFormValues: ApiTokenFormValues = {
  description: '',
  validUntil: '',
  rights: [],
}
