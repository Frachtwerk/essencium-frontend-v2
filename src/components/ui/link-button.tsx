import { createLink, type LinkComponent } from '@tanstack/react-router'
import type { VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LinkButtonProps
  extends
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  disabled?: boolean
}

const LinkButtonComponent = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (
    { className, variant = 'default', size = 'default', disabled, ...props },
    ref,
  ) => {
    return (
      <a
        ref={ref}
        data-slot="button"
        className={cn(
          buttonVariants({ variant, size, className }),
          disabled && 'pointer-events-none opacity-50',
        )}
        aria-disabled={disabled || undefined}
        {...(disabled
          ? { onClick: e => e.preventDefault(), tabIndex: -1 }
          : {})}
        {...props}
      />
    )
  },
)
LinkButtonComponent.displayName = 'LinkButton'

/** A button styled like {@link Button} that navigates via TanStack Router. */
export const LinkButton: LinkComponent<typeof LinkButtonComponent> =
  createLink(LinkButtonComponent)
