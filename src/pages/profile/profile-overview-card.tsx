import { useTranslation } from 'react-i18next'

import { initials } from '@/components/layout/nav-user'
import { Avatar, AvatarBadge, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { UserRepresentation } from '@/generated/client'
import { isSsoManaged } from '@/lib/sso'

interface ProfileOverviewCardProps {
  currentUser: UserRepresentation
}

export function ProfileOverviewCard({
  currentUser,
}: Readonly<ProfileOverviewCardProps>): React.ReactElement {
  const { t } = useTranslation()

  return (
    <Card className="justify-center lg:w-1/4 lg:shrink-0">
      <CardContent className="flex flex-col items-center gap-6">
        <Avatar size="xl">
          <AvatarFallback>
            {initials(currentUser.firstName, currentUser.lastName)}
          </AvatarFallback>

          <AvatarBadge
            className={
              currentUser.enabled ? 'bg-primary' : 'bg-muted-foreground'
            }
          />
        </Avatar>

        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-semibold">
              {[currentUser.firstName, currentUser.lastName]
                .filter(Boolean)
                .join(' ')}
            </span>

            <Badge variant={currentUser.enabled ? 'default' : 'outline'}>
              {currentUser.enabled
                ? t('users.status.active')
                : t('users.status.inactive')}
            </Badge>

            {isSsoManaged(currentUser.source) && (
              <Badge variant="secondary">{currentUser.source}</Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {currentUser.roles?.map(role => (
              <Badge key={role.name} variant="outline">
                {role.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
