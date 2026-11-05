import { RiCheckLine, RiCloseLine } from '@remixicon/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { passwordRules } from '@/lib/password-rules'
import { cn } from '@/lib/utils'

/** Wraps a password input and shows the rules as a tooltip while it is focused and non-empty. */
export function PasswordChecklist({
  value,
  children,
}: Readonly<{
  value: string
  children: React.ReactNode
}>): React.ReactElement {
  const { t } = useTranslation()
  const [focused, setFocused] = useState(false)

  return (
    <Tooltip open={focused && value.length > 0}>
      <TooltipTrigger
        render={
          <div
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        }
      >
        {children}
      </TooltipTrigger>

      <TooltipContent side="bottom" align="start" className="max-w-none py-2">
        <ul className="space-y-1" aria-live="polite">
          {passwordRules.map(({ key, test }) => {
            const passed = test(value)
            const Icon = passed ? RiCheckLine : RiCloseLine
            return (
              <li
                key={key}
                className={cn(
                  'flex items-center gap-1.5',
                  passed ? 'text-primary' : 'text-background/70',
                )}
              >
                <Icon className="size-4" aria-hidden />
                {t(`common.passwordRules.${key}`)}
              </li>
            )
          })}
        </ul>
      </TooltipContent>
    </Tooltip>
  )
}
