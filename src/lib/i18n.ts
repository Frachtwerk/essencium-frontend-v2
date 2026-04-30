import dayjs from 'dayjs'
import 'dayjs/locale/de'
import 'dayjs/locale/en'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import de from '@/locales/de/common.json'
import en from '@/locales/en/common.json'

export const supportedLanguages = ['de', 'en'] as const
export type SupportedLanguage = (typeof supportedLanguages)[number]

// eslint-disable-next-line import-x/no-named-as-default-member
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      de: { common: de },
      en: { common: en },
    },
    defaultNS: 'common',
    ns: ['common'],
    fallbackLng: 'de',
    supportedLngs: supportedLanguages,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
  })

function syncDayjsLocale(lng: string): void {
  dayjs.locale(lng)
}

syncDayjsLocale(i18n.language)
i18n.on('languageChanged', syncDayjsLocale)

export default i18n
