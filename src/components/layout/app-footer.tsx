import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { version } from '../../../package.json'

const LINKS = [
  { to: '/privacy', label: 'common.privacy' },
  { to: '/legal-notice', label: 'common.legalNotice' },
  { to: '/contact', label: 'common.contact' },
] as const

export function AppFooter(): React.ReactElement {
  const { t } = useTranslation()

  return (
    <footer className="text-muted-foreground mt-auto flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3 text-sm">
      <span>
        {t('common.licenseVersion', { year: dayjs().year(), version })}
      </span>

      <nav aria-label={t('common.footerNavigation')} className="flex gap-4">
        {LINKS.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="hover:text-foreground underline-offset-4 hover:underline"
          >
            {t(label)}
          </Link>
        ))}
      </nav>
    </footer>
  )
}
