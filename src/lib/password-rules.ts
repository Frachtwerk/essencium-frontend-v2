export const MIN_PASSWORD_LENGTH = 12

export const passwordRules = [
  { key: 'minLength', test: (v: string) => v.length >= MIN_PASSWORD_LENGTH },
  { key: 'upperCase', test: (v: string) => /[A-Z]/.test(v) },
  { key: 'lowerCase', test: (v: string) => /[a-z]/.test(v) },
  { key: 'number', test: (v: string) => /\d/.test(v) },
  { key: 'specialCharacter', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
] as const
