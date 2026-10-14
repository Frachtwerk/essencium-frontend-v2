import { z } from 'zod'

export const contactFormSchema = z.object({
  subject: z.string().min(1, 'contact.validation.subject'),
  message: z.string().min(1, 'contact.validation.message'),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

export const defaultContactFormValues: ContactFormValues = {
  subject: '',
  message: '',
}
