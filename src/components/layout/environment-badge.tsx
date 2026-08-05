import { Badge } from '@/components/ui/badge'

export function EnvironmentBadge(): React.ReactElement | null {
  const environment = import.meta.env.VITE_APP_ENV
  if (!environment || environment === 'production') return null

  return (
    <Badge variant="secondary" className="uppercase">
      {environment}
    </Badge>
  )
}
