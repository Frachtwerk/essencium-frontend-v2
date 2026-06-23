import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/layout/page-header'

export const Route = createFileRoute('/_authenticated/users/')({
  component: UsersPage,
})

function UsersPage(): React.ReactElement {
  const { t } = useTranslation()
  return (
    <div className="p-6">
      <PageHeader title={t('users.title')} />
    </div>
  )
}
