import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/layout/page-header'
import { PageWrapper } from '@/components/layout/page-wrapper'
import { Separator } from '@/components/ui/separator'

const SECTIONS = ['disclaimer', 'copyright'] as const

export function LegalNoticePage(): React.ReactElement {
  const { t } = useTranslation()

  return (
    <PageWrapper className="space-y-4">
      <PageHeader title={t('legalNotice.title')} />

      <Separator />

      <h2 className="text-xl font-semibold">
        {t('legalNotice.companyInformation')}
      </h2>

      <address>
        Frachtwerk GmbH
        <br />
        Leopoldstraße 7C
        <br />
        76133 Karlsruhe
        <br />
        {t('legalNotice.country')}
        <br />
        {t('legalNotice.phone', { phone: '+49 (0) 721/1234567' })}
        <br />
        {t('legalNotice.email', { email: 'info@frachtwerk.de' })}
        <br />
        {t('legalNotice.managingDirector', { name: 'Max Mustermann' })}
      </address>

      <Separator />

      <h2 className="text-xl font-semibold">
        {t('legalNotice.regulatoryAuthority')}
      </h2>

      <address>
        Example Regulatory Authority
        <br />
        Musterstraße 1
        <br />
        12345 Musterstadt
      </address>

      {SECTIONS.map(section => (
        <Fragment key={section}>
          <Separator />

          <h2 className="text-xl font-semibold">
            {t(`legalNotice.${section}`)}
          </h2>

          <p className="w-full lg:w-1/2">{t(`legalNotice.${section}Text`)}</p>
        </Fragment>
      ))}
    </PageWrapper>
  )
}
