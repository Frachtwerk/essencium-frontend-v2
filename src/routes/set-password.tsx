import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useMutation } from '@tanstack/react-query'
import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { PasswordChecklist } from '@/components/password-checklist'
import { PasswordInput } from '@/components/password-input'
import { FullPageSpinner } from '@/components/spinner'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { setNewPassword } from '@/generated/client/sdk.gen'
import { baseClient, getAccessToken, waitForAuth } from '@/lib/auth-store'
import { cn } from '@/lib/utils'
import { passwordSchema } from '@/pages/users/user-form-schema'

const searchSchema = z.object({
  token: z.string().optional(),
})

export const Route = createFileRoute('/set-password')({
  beforeLoad: async () => {
    await waitForAuth()
    if (getAccessToken()) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/' })
    }
  },
  validateSearch: searchSchema,
  component: SetPasswordPage,
  pendingComponent: FullPageSpinner,
})

const setPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'auth.passwordMismatch',
  })

type SetPasswordForm = z.infer<typeof setPasswordSchema>

function SetPasswordPage(): React.ReactElement {
  const { t } = useTranslation()
  const { token } = Route.useSearch()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SetPasswordForm>({
    resolver: standardSchemaResolver(setPasswordSchema),
    mode: 'onBlur',
  })

  const password = useWatch({ control, name: 'password', defaultValue: '' })

  const mutation = useMutation({
    mutationFn: (data: SetPasswordForm) =>
      setNewPassword({
        client: baseClient,
        body: { password: data.password, verification: token ?? '' },
      }),
  })

  if (!token) {
    return (
      <div className="bg-background flex min-h-svh items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t('auth.setPassword')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-destructive text-center text-sm">
              {t('auth.invalidResetToken')}
            </p>
            <Link
              to="/login"
              className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
            >
              {t('auth.goToLogin')}
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (mutation.isSuccess) {
    return (
      <div className="bg-background flex min-h-svh items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t('auth.setPassword')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-center text-sm">
              {t('auth.setPasswordSuccess')}
            </p>
            <Link to="/login" className={cn(buttonVariants(), 'w-full')}>
              {t('auth.goToLogin')}
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-background flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('auth.setPassword')}</CardTitle>

          <CardDescription>{t('auth.setPasswordDescription')}</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={e => void handleSubmit(data => mutation.mutate(data))(e)}
            className="space-y-4"
          >
            {mutation.isError && (
              <div className="bg-destructive text-destructive-foreground rounded-md p-3 text-sm">
                {mutation.error instanceof Error
                  ? mutation.error.message
                  : t('error.unknown')}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.newPassword')}</Label>

              <PasswordChecklist value={password}>
                <PasswordInput
                  id="password"
                  autoComplete="new-password"
                  {...register('password')}
                />
              </PasswordChecklist>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t('auth.confirmPassword')}
              </Label>

              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-sm">
                  {t('auth.passwordMismatch')}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? t('auth.setPasswordPending')
                : t('auth.setPassword')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
