import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

export function Spinner({
  className,
}: Readonly<{ className?: string }>): React.ReactElement {
  return (
    <Loader2
      className={cn('text-muted-foreground h-6 w-6 animate-spin', className)}
    />
  )
}

export function FullPageSpinner(): React.ReactElement {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  )
}

export function ContentSpinner(): React.ReactElement {
  return (
    <div className="flex flex-1 items-center justify-center p-12">
      <Spinner />
    </div>
  )
}
