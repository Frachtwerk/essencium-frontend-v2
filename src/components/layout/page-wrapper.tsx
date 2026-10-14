import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export function PageWrapper({
  className,
  ...props
}: ComponentProps<'div'>): React.ReactElement {
  return <div className={cn('mx-auto w-[95%] py-6', className)} {...props} />
}
