import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/layout/page-header'

export const Route = createFileRoute('/_authenticated/roles')({
  component: RolesPage,
})

function RolesPage(): React.ReactElement {
  const { t } = useTranslation()
  return (
    <div className="p-6">
      <PageHeader title={t('roles.title')} />
    </div>
  )
}
