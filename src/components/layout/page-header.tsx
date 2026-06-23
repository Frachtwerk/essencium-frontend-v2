import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  /** Optional actions rendered on the right (e.g. a "Create" button). */
  actions?: ReactNode
}

/** Consistent page title block for content pages. */
export function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps): React.ReactElement {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
