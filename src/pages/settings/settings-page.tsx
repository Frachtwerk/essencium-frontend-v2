import { RiComputerLine, RiMoonLine, RiSunLine } from '@remixicon/react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import type { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
          <Label id="settings-appearance">
            {t('settings.appearance.label')}
          </Label>

          <RadioGroup
            value={selectedTheme}
            onValueChange={value => {
              if (isThemeOption(value)) {
                setSelectedTheme(value)
              }
            }}
            className="max-w-sm"
            aria-labelledby="settings-appearance"
          >
            {THEME_OPTIONS.map(({ value, labelKey, icon: Icon }) => (
              <FieldLabel key={value}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>
                      <Icon />
                      {t(labelKey)}
                    </FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value={value} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
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
