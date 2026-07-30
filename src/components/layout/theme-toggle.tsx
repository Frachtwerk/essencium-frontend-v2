import { RiComputerLine, RiMoonLine, RiSunLine } from '@remixicon/react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { themeOptions } from '@/lib/theme'

/** Light / dark / system theme switcher. */
export function ThemeToggle(): React.ReactElement {
  const { t } = useTranslation()
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={t('theme.toggle')}>
            <RiSunLine className="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <RiMoonLine className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme(themeOptions.LIGHT)}>
          <RiSunLine className="size-4" />
          {t('theme.light')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(themeOptions.DARK)}>
          <RiMoonLine className="size-4" />
          {t('theme.dark')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(themeOptions.SYSTEM)}>
          <RiComputerLine className="size-4" />
          {t('theme.system')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
