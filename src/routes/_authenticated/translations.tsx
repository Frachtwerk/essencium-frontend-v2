import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { getTranslationsQueryOptions } from '@/hooks/data/translations'
import { assertRights, RIGHTS } from '@/lib/permissions'
import { TRANSLATION_LOCALES } from '@/lib/translations'
import { TranslationsPage } from '@/pages/translations/translations-page'

const translationsSearchSchema = z.object({
  locale: z.enum(TRANSLATION_LOCALES).optional().default('de'),
  search: z.string().optional().default(''),
})

export const Route = createFileRoute('/_authenticated/translations')({
  beforeLoad: async ({ context: { queryClient }, location }) => {
    await assertRights(
      queryClient,
      RIGHTS.TRANSLATION_READ,
      'any',
      location.href,
    )
  },
  component: TranslationsPage,
  validateSearch: translationsSearchSchema,
  loaderDeps: ({ search: { locale } }) => ({ locale }),
  loader: ({ context: { queryClient }, deps: { locale } }) =>
    queryClient.ensureQueryData(getTranslationsQueryOptions(locale)),
})
