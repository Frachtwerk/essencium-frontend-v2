import { RiComputerLine, RiMoonLine, RiSunLine } from '@remixicon/react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import type { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  languageLabels,
  supportedLanguages,
  type SupportedLanguage,
} from '@/lib/i18n'
import { isThemeOption, themeOptions, type ThemeOption } from '@/lib/theme'
import { cn } from '@/lib/utils'

const THEME_OPTIONS: ReadonlyArray<{
  value: ThemeOption
  labelKey: 'theme.light' | 'theme.dark' | 'theme.system'
  icon: ComponentType<{ className?: string }>
}> = [
  { value: themeOptions.LIGHT, labelKey: 'theme.light', icon: RiSunLine },
  { value: themeOptions.DARK, labelKey: 'theme.dark', icon: RiMoonLine },
  {
    value: themeOptions.SYSTEM,
    labelKey: 'theme.system',
    icon: RiComputerLine,
  },
]

export function SettingsPage(): React.ReactElement {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()

  const currentTheme: ThemeOption = isThemeOption(theme)
    ? theme
    : themeOptions.SYSTEM

  const currentLanguage = (i18n.resolvedLanguage ??
    i18n.language) as SupportedLanguage

  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(currentTheme)
  const [selectedLanguage, setSelectedLanguage] =
    useState<SupportedLanguage>(currentLanguage)

  // Keep the staged selection in sync when theme/language change elsewhere
  // (e.g. the header switchers) while this page is open.
  const [lastTheme, setLastTheme] = useState<ThemeOption>(currentTheme)
  if (currentTheme !== lastTheme) {
    setLastTheme(currentTheme)
    setSelectedTheme(currentTheme)
  }

  const [lastLanguage, setLastLanguage] =
    useState<SupportedLanguage>(currentLanguage)
  if (currentLanguage !== lastLanguage) {
    setLastLanguage(currentLanguage)
    setSelectedLanguage(currentLanguage)
  }

  const isDirty =
    selectedTheme !== currentTheme || selectedLanguage !== currentLanguage

  async function handleSave(): Promise<void> {
    setTheme(selectedTheme)
    try {
      if (selectedLanguage !== currentLanguage) {
        await i18n.changeLanguage(selectedLanguage)
      }
      toast.success(t('settings.saveSuccess'))
    } catch {
      toast.error(t('settings.saveError'))
    }
  }

  return (
    <div className="p-6">
      <PageHeader title={t('settings.title')} />

      <div className="max-w-2xl space-y-8">
        <section className="space-y-2">
          <Label htmlFor="settings-appearance">
            {t('settings.appearance.label')}
          </Label>
          <div
            id="settings-appearance"
            role="radiogroup"
            aria-label={t('settings.appearance.label')}
            className="grid grid-cols-3 gap-4"
          >
            {THEME_OPTIONS.map(({ value, labelKey, icon: Icon }) => {
              const active = selectedTheme === value
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSelectedTheme(value)}
                  className={cn(
                    'bg-card flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border px-4 py-6 text-sm font-medium ring-1 ring-transparent transition-colors outline-none',
                    'hover:bg-accent focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
                    active
                      ? 'border-primary bg-primary/5 text-primary ring-primary/20'
                      : 'border-border text-foreground',
                  )}
                >
                  <Icon className="size-6" />
                  {t(labelKey)}
                </button>
              )
            })}
          </div>
        </section>

        <section className="space-y-2">
          <Label htmlFor="settings-language">
            {t('settings.language.label')}
          </Label>
          <Select
            value={selectedLanguage}
            onValueChange={value => {
              if (value) setSelectedLanguage(value)
            }}
          >
            <SelectTrigger id="settings-language" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="p-1">
              {supportedLanguages.map(lng => (
                <SelectItem key={lng} value={lng}>
                  {languageLabels[lng]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        <Separator />

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => void handleSave()}
            disabled={!isDirty}
          >
            {t('settings.save')}
          </Button>
        </div>
      </div>
    </div>
  )
}
