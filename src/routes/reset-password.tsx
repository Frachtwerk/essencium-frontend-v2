import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useMutation } from '@tanstack/react-query'
import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { RouteError } from '@/components/error-fallback'
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
  errorComponent: RouteError,
})

const resetPasswordSchema = z.object({
  email: z.string().email(),
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

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
    mutationFn: (data: ResetPasswordForm) =>
      requestResetToken({ client: baseClient, body: data.email }),
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
              <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
                {mutation.error instanceof Error
                  ? mutation.error.message
                  : t('error.unknown')}
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
