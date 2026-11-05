import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/layout/page-header'
import { PageWrapper } from '@/components/layout/page-wrapper'
import { Separator } from '@/components/ui/separator'

const SECTIONS = [
  'introduction',
  'dataCollection',
  'dataUsage',
  'dataProtection',
] as const

export function PrivacyPage(): React.ReactElement {
  const { t } = useTranslation()

  return (
    <PageWrapper className="space-y-4">
      <PageHeader title={t('privacy.title')} />

      {SECTIONS.map(section => (
        <Fragment key={section}>
          <Separator />

          <h2 className="text-xl font-semibold">{t(`privacy.${section}`)}</h2>

          <p className="w-full lg:w-1/2">{t(`privacy.${section}Text`)}</p>
        </Fragment>
      ))}

      <h2 className="text-xl font-semibold">
        {t('privacy.contactInformation')}
      </h2>

      <p>{t('privacy.contactInformationText')}</p>

      <address>
        {t('privacy.email', { email: 'privacy@frachtwerk.de' })}
        <br />
        {t('privacy.phone', { phone: '+49 (0) 721/7654321' })}
      </address>
    </PageWrapper>
  )
}
