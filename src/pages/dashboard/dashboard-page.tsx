import {
  RiArrowRightLine,
  RiGroupLine,
  RiShieldCheckLine,
  RiUserLine,
  type RemixiconComponentType,
} from '@remixicon/react'
import { Link } from '@tanstack/react-router'
import type { LinkProps } from '@tanstack/react-router'
import type { ParseKeys } from 'i18next'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/layout/page-header'
import { CanAccess } from '@/components/shared/can-access'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useCurrentUser } from '@/hooks/use-current-user'
import { RIGHTS, type Right } from '@/lib/permissions'

interface QuickLink {
  to: LinkProps['to']
  icon: RemixiconComponentType
  titleKey: ParseKeys
  descKey: ParseKeys
  rights?: Right | readonly Right[]
}

const QUICK_LINKS: readonly QuickLink[] = [
  {
    to: '/users',
    icon: RiGroupLine,
    titleKey: 'navigation.users',
    descKey: 'dashboard.cards.users',
    rights: RIGHTS.USER_READ,
  },
  {
    to: '/roles',
    icon: RiShieldCheckLine,
    titleKey: 'navigation.roles',
    descKey: 'dashboard.cards.roles',
    rights: [RIGHTS.ROLE_READ, RIGHTS.RIGHT_READ],
  },
  {
    to: '/profile',
    icon: RiUserLine,
    titleKey: 'navigation.profile',
    descKey: 'dashboard.cards.profile',
  },
]

export function DashboardPage(): React.ReactElement {
  const { t } = useTranslation()
  const { data: user } = useCurrentUser()

  return (
    <div className="space-y-8 p-6">
      <PageHeader
        title={
          user.firstName
            ? t('dashboard.greetingName', { name: user.firstName })
            : t('dashboard.greeting')
        }
        description={t('dashboard.subtitle')}
      />

      <section className="space-y-3">
        <h2 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
          {t('dashboard.quickAccess')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map(link => (
            <CanAccess key={link.to} rights={link.rights ?? []}>
              <Link to={link.to} className="group block">
                <Card className="hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="bg-accent text-accent-foreground flex size-10 items-center justify-center rounded-md">
                      <link.icon className="size-5" />
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      {t(link.titleKey)}
                      <RiArrowRightLine className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5" />
                    </CardTitle>
                    <CardDescription>{t(link.descKey)}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </CanAccess>
          ))}
        </div>
      </section>
    </div>
  )
}
