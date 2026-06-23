import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { supportedLanguages } from '@/lib/i18n'

const LANGUAGE_LABELS: Record<string, string> = {
  de: 'Deutsch',
  en: 'English',
}

/** Switches the active i18n language (persisted via the language detector). */
export function LanguageSwitcher(): React.ReactElement {
  const { t, i18n } = useTranslation()
  const current = i18n.resolvedLanguage ?? i18n.language

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={t('language.switch')}>
            <Languages className="size-5" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {supportedLanguages.map(lng => (
          <DropdownMenuItem
            key={lng}
            onClick={() => void i18n.changeLanguage(lng)}
            data-active={lng === current}
            className="data-[active=true]:font-semibold"
          >
            {LANGUAGE_LABELS[lng] ?? lng.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
