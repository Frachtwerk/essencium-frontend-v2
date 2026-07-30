export const themeOptions = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const

export type ThemeOption = (typeof themeOptions)[keyof typeof themeOptions]

export function isThemeOption(value: string | undefined): value is ThemeOption {
  return Object.values(themeOptions).includes(value as ThemeOption)
}
