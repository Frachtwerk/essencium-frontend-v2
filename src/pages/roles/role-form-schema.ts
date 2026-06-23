import { z } from 'zod'

export const roleFormSchema = z.object({
  name: z.string().min(2, 'roles.validation.name'),
  description: z.string().optional(),
  rights: z.array(z.string()),
})

export type RoleFormValues = z.infer<typeof roleFormSchema>

export const defaultRoleFormValues: RoleFormValues = {
  name: '',
  description: '',
  rights: [],
}
