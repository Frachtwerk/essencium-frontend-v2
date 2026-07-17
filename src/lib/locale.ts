export const SUPPORTED_LOCALES = ['de', 'en'] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export function toSupportedLocale(value: string | undefined): SupportedLocale {
  // Cast lets includes() check a generic string; safe once the true-check passes.
  return SUPPORTED_LOCALES.includes(value as SupportedLocale)
    ? (value as SupportedLocale)
    : SUPPORTED_LOCALES[0]
}
