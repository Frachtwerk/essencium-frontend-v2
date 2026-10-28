import {
  RiExternalLinkLine,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
} from '@remixicon/react'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import {
  contactFormSchema,
  defaultContactFormValues,
  type ContactFormValues,
} from './contact-form-schema'

import { PageHeader } from '@/components/layout/page-header'
import { PageWrapper } from '@/components/layout/page-wrapper'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useSendContactRequest } from '@/hooks/data/contact'
import { useCurrentUser } from '@/hooks/use-current-user'
import { zodFormResolver } from '@/lib/zod-resolver'

const CONTACT_PERSON = {
  name: 'Sandra Galuba',
  phone: '+49 30 209669462',
  email: 'contact@frachtwerk.de',
  address: 'Große Präsidentenstraße 10, 10178 Berlin',
  linkedinUrl: 'https://www.linkedin.com/company/frachtwerk',
  instagramUrl: 'https://www.instagram.com/frachtwerk.de/',
}

const SOCIAL_LINKS = [
  ['LinkedIn', CONTACT_PERSON.linkedinUrl],
  ['Instagram', CONTACT_PERSON.instagramUrl],
] as const

export function ContactPage(): React.ReactElement {
  const { t } = useTranslation()

  const { data: currentUser } = useCurrentUser()

  const { mutate: sendMessage, isPending } = useSendContactRequest()

  const form = useForm<ContactFormValues>({
    resolver: zodFormResolver(contactFormSchema),
    mode: 'onBlur',
    defaultValues: defaultContactFormValues,
  })

  function handleSubmit(values: ContactFormValues): void {
    sendMessage(
      {
        body: {
          ...values,
          name: `${currentUser.firstName ?? ''} ${currentUser.lastName ?? ''}`.trim(),
          mailAddress: currentUser.email,
        },
      },
      {
        onSuccess: () => {
          toast.success(t('contact.sendSuccess'))
          form.reset(defaultContactFormValues)
        },
        onError: () => toast.error(t('contact.sendError')),
      },
    )
  }

  return (
    <PageWrapper>
      <PageHeader
        title={t('contact.title')}
        description={t('contact.description')}
      />

      <div className="flex flex-col gap-4 lg:flex-row">
        <Card className="flex-1">
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={e => void form.handleSubmit(handleSubmit)(e)}
                className="space-y-2.5"
              >
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>
                        {t('contact.form.subject')}
                      </FormLabel>

                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>
                        {t('contact.form.message')}
                      </FormLabel>

                      <FormControl>
                        <Textarea rows={12} {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isPending} className="mt-6">
                  {isPending ? t('contact.sending') : t('contact.send')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="min-w-[400px]">
          <CardHeader>
            <CardTitle>{CONTACT_PERSON.name}</CardTitle>

            <CardDescription>{t('contact.contactPerson')}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            <a
              href={`tel:${CONTACT_PERSON.phone.replaceAll(' ', '')}`}
              className="flex items-center gap-2 hover:underline"
            >
              <RiPhoneLine className="size-4" aria-hidden />
              {CONTACT_PERSON.phone}
            </a>

            <a
              href={`mailto:${CONTACT_PERSON.email}`}
              className="flex items-center gap-2 hover:underline"
            >
              <RiMailLine className="size-4" aria-hidden />
              {CONTACT_PERSON.email}
            </a>

            <p className="flex items-center gap-2">
              <RiMapPinLine className="size-4" aria-hidden />
              {CONTACT_PERSON.address}
            </p>

            {SOCIAL_LINKS.map(([label, href]) => (
              <Link
                key={label}
                to={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                <RiExternalLinkLine className="size-4" aria-hidden />
                {label}
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}
