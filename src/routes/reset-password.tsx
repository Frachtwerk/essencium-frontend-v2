import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useMutation } from '@tanstack/react-query'
import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FullPageSpinner } from '@/components/spinner'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { requestResetToken } from '@/generated/client/sdk.gen'
import { ApiError } from '@/lib/api-error'
import { baseClient, getAccessToken, waitForAuth } from '@/lib/auth-store'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/reset-password')({
  beforeLoad: async () => {
    await waitForAuth()
    if (getAccessToken()) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/' })
    }
  },
  component: ResetPasswordPage,
  pendingComponent: FullPageSpinner,
})

const resetPasswordSchema = z.object({
  email: z.string().email(),
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

// The backend answers 204 for unknown emails too (no user enumeration), but
// 403 for accounts that sign in via SSO.
function resetPasswordErrorKey(
  error: Error,
): 'auth.resetNotAllowed' | 'error.unknown' {
  return error instanceof ApiError && error.status === 403
    ? 'auth.resetNotAllowed'
    : 'error.unknown'
}

function ResetPasswordPage(): React.ReactElement {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: standardSchemaResolver(resetPasswordSchema),
  })

  const mutation = useMutation({
    mutationFn: async (data: ResetPasswordForm) => {
      const { error, response } = await requestResetToken({
        client: baseClient,
        body: data.email,
      })
      if (error) throw new ApiError(response?.status)
    },
  })

  if (mutation.isSuccess) {
    return (
      <div className="bg-background flex min-h-svh items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {t('auth.resetPassword')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-center text-sm">
              {t('auth.resetPasswordSuccess')}
            </p>
            <Link
              to="/login"
              className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
            >
              {t('auth.backToLogin')}
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
          <CardTitle className="text-2xl">{t('auth.resetPassword')}</CardTitle>
          <CardDescription>
            {t('auth.resetPasswordDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={e => void handleSubmit(data => mutation.mutate(data))(e)}
            className="space-y-4"
          >
            {mutation.isError && (
              <div className="bg-destructive text-destructive-foreground rounded-md p-3 text-sm">
                {t(resetPasswordErrorKey(mutation.error))}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-destructive text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? t('auth.resetPasswordPending')
                : t('auth.resetPassword')}
            </Button>
            <Link
              to="/login"
              className={cn(buttonVariants({ variant: 'ghost' }), 'w-full')}
            >
              {t('auth.backToLogin')}
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
