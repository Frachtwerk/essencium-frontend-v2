import { Link, useRouterState } from '@tanstack/react-router'
import type { ParseKeys } from 'i18next'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

/** i18n key per top-level path segment; unknown segments fall back to the raw value. */
const SEGMENT_LABELS: Record<string, ParseKeys> = {
  users: 'users.title',
  roles: 'roles.title',
  profile: 'profile.title',
  settings: 'settings.title',
}

interface Crumb {
  label: string
  to: string
  isLast: boolean
}

/** Auto-generated breadcrumb trail from the current route path. */
export function Breadcrumbs(): React.ReactElement {
  const { t } = useTranslation()
  const pathname = useRouterState({ select: s => s.location.pathname })

  const segments = pathname.split('/').filter(Boolean)

  const crumbs: Crumb[] = segments.map((segment, index) => {
    const to = '/' + segments.slice(0, index + 1).join('/')
    const labelKey = SEGMENT_LABELS[segment]
    return {
      label: labelKey ? t(labelKey) : decodeURIComponent(segment),
      to,
      isLast: index === segments.length - 1,
    }
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {crumbs.length === 0 ? (
            <BreadcrumbPage>{t('navigation.dashboard')}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink render={<Link to="/" />}>
              {t('navigation.dashboard')}
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {crumbs.map(crumb => (
          <Fragment key={crumb.to}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink>{crumb.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
