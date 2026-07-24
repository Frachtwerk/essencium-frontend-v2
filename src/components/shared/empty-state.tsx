import type { RemixiconComponentType } from '@remixicon/react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: RemixiconComponentType
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border py-16 text-center">
      <Icon className="text-muted-foreground size-10" />
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
