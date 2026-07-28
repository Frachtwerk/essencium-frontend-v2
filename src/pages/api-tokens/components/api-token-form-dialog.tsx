import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  apiTokenFormSchema,
  defaultApiTokenFormValues,
  type ApiTokenFormValues,
} from './api-token-form-schema'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { useTokenExpirationInfo } from '@/hooks/data/api-tokens'
import { useMyRights } from '@/hooks/data/me'
import { zodFormResolver } from '@/lib/zod-resolver'

interface ApiTokenFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: ApiTokenFormValues) => void
  isSubmitting?: boolean
}

export function ApiTokenFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: ApiTokenFormDialogProps): React.ReactElement {
  const { t } = useTranslation()
  const { data: myRights } = useMyRights()
  const availableRights = myRights.filter(
    right => right.authority !== undefined,
  )
  const { data: expirationInfoSeconds } = useTokenExpirationInfo()
  const defaultExpirationDays = Math.round(
    expirationInfoSeconds / (60 * 60 * 24),
  )

  const form = useForm<ApiTokenFormValues>({
    resolver: zodFormResolver(apiTokenFormSchema),
    mode: 'onChange',
    defaultValues: defaultApiTokenFormValues,
  })

  useEffect(() => {
    if (!open) form.reset(defaultApiTokenFormValues)
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('apiTokens.createTitle')}</DialogTitle>
          <DialogDescription>
            {t('apiTokens.formDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={e => void form.handleSubmit(onSubmit)(e)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('apiTokens.form.description')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="validUntil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('apiTokens.form.validUntil')}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  {!field.value && (
                    <FormDescription>
                      {t('apiTokens.form.validUntilHint', {
                        days: defaultExpirationDays,
                      })}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rights"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('apiTokens.form.rights')}</FormLabel>
                  <div className="grid max-h-56 gap-2 overflow-y-auto rounded-md border p-3 sm:grid-cols-2">
                    {availableRights.map(right => (
                      <Label
                        key={right.authority}
                        className="flex items-center gap-2 font-normal"
                      >
                        <Checkbox
                          checked={field.value.includes(right.authority ?? '')}
                          onCheckedChange={isChecked => {
                            const authority = right.authority ?? ''
                            field.onChange(
                              isChecked
                                ? [...field.value, authority]
                                : field.value.filter(r => r !== authority),
                            )
                          }}
                        />
                        {right.authority}
                      </Label>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid || isSubmitting}
              >
                {isSubmitting ? t('common.saving') : t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
