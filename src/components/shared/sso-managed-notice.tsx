import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { isSsoManaged } from '@/lib/sso'

interface SsoManagedNoticeProps {
  ssoProvider?: string
}

export function SsoManagedNotice({
  ssoProvider,
}: SsoManagedNoticeProps): React.ReactElement | null {
  const { t } = useTranslation()

  if (!isSsoManaged(ssoProvider)) return null

  return (
    <div className="flex items-center gap-2 rounded-md border p-3 text-sm">
      <Badge variant="secondary">{ssoProvider}</Badge>
      <span className="text-muted-foreground">
        {t('users.form.ssoManaged')}
      </span>
    </div>
  )
}
