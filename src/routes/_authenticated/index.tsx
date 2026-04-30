import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardPage,
})

function DashboardPage(): React.ReactElement {
  const { t } = useTranslation()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{t('navigation.dashboard')}</h1>
    </div>
  )
}
