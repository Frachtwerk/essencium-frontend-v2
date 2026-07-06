import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  defaultUserFormValues,
  SUPPORTED_LOCALES,
  userFormSchema,
  type UserFormValues,
} from './user-form-schema'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useAllRoles } from '@/hooks/data/roles'
import { zodFormResolver } from '@/lib/zod-resolver'

interface UserFormProps {
  mode: 'create' | 'edit'
  initialValues?: UserFormValues
  onSubmit: (values: UserFormValues) => void
  isSubmitting?: boolean
  ssoProvider?: string
}

export function UserForm({
  mode,
  initialValues,
  onSubmit,
  isSubmitting,
  ssoProvider,
}: UserFormProps): React.ReactElement {
  const { t } = useTranslation()
  const { data: rolesPage } = useAllRoles()
  const roles = rolesPage.content ?? []
  const isSso = Boolean(ssoProvider && ssoProvider !== 'LOCAL')

  const form = useForm<UserFormValues>({
    resolver: zodFormResolver(userFormSchema),
    defaultValues: initialValues ?? defaultUserFormValues,
  })

  return (
    <Form {...form}>
      <form
        onSubmit={e => void form.handleSubmit(onSubmit)(e)}
        className="max-w-2xl space-y-6"
      >
        {isSso && (
          <div className="flex items-center gap-2 rounded-md border p-3 text-sm">
            <Badge variant="secondary">{ssoProvider}</Badge>
            <span className="text-muted-foreground">
              {t('users.form.ssoManaged')}
            </span>
          </div>
        )}
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.form.password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  {...field}
                  disabled={isSso}
                />
              </FormControl>
              <FormDescription>
                {mode === 'create'
                  ? t('users.form.passwordCreateHint')
                  : t('users.form.passwordEditHint')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="enabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-md border p-3">
              <div className="space-y-0.5">
                <FormLabel>{t('users.form.enabled')}</FormLabel>
                <FormDescription>{t('users.form.enabledHint')}</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.form.roles')}</FormLabel>
              <div className="grid gap-2 sm:grid-cols-2">
                {roles.map(role => {
                  const checked = field.value.includes(role.name)
                  return (
                    <Label
                      key={role.name}
                      className="flex items-center gap-2 rounded-md border p-2 font-normal"
                    >
                      <Checkbox
                        checked={checked}
                        disabled={isSso}
                        onCheckedChange={isChecked => {
                          field.onChange(
                            isChecked
                              ? [...field.value, role.name]
                              : field.value.filter(r => r !== role.name),
                          )
                        }}
                      />
                      {role.name}
                    </Label>
                  )
                })}
              </div>
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
