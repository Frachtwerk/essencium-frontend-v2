import { z } from 'zod'

export const TRANSLATION_LOCALES = ['de', 'en'] as const

export type TranslationLocale = (typeof TRANSLATION_LOCALES)[number]

interface NestedTranslations {
  [key: string]: string | NestedTranslations
}

const nestedTranslationsSchema: z.ZodType<NestedTranslations> = z.lazy(() =>
  z.record(z.string(), z.union([z.string(), nestedTranslationsSchema])),
)

export interface TranslationEntry {
  key: string
  value: string
}

export interface TranslationGroup {
  name: string
  entries: TranslationEntry[]
  groups: TranslationGroup[]
}

/** Parses the nested JSON file the backend returns into flat, dotted-key entries. */
export function parseTranslationFile(raw: unknown): TranslationEntry[] {
  const entries: TranslationEntry[] = []

  function walk(node: NestedTranslations, prefix: string): void {
    for (const [name, child] of Object.entries(node)) {
      const key = prefix ? `${prefix}.${name}` : name
      if (typeof child === 'string') entries.push({ key, value: child })
      else walk(child, key)
    }
  }

  walk(nestedTranslationsSchema.parse(raw), '')
  return entries
}

const HTML_TAG = /<[a-z][^>]*>/i

export function isMarkup(value: string): boolean {
  return HTML_TAG.test(value)
}

/**
 * Readable plain-text preview of an HTML value. Only `textContent` of an inert
 * parsed document is used, so markup is never rendered or executed.
 */
export function toDisplayText(value: string): string {
  if (!isMarkup(value)) return value

  const withBreaks = value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
  const text =
    new DOMParser().parseFromString(withBreaks, 'text/html').body.textContent ??
    ''

  return text
    .replace(/[ \t]*\n[ \t]*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function filterTranslations(
  entries: TranslationEntry[],
  search: string,
): TranslationEntry[] {
  const needle = search.trim().toLowerCase()
  if (!needle) return entries
  return entries.filter(
    ({ key, value }) =>
      key.toLowerCase().includes(needle) ||
      value.toLowerCase().includes(needle),
  )
}

/** Groups entries by their dotted key segments; the last segment stays on the entry. */
export function groupTranslations(
  entries: TranslationEntry[],
): TranslationGroup {
  const root: TranslationGroup = { name: '', entries: [], groups: [] }

  for (const entry of entries) {
    const segments = entry.key.split('.').slice(0, -1)
    let group = root
    for (const name of segments) {
      let child = group.groups.find(g => g.name === name)
      if (!child) {
        child = { name, entries: [], groups: [] }
        group.groups.push(child)
      }
      group = child
    }
    group.entries.push(entry)
  }

  return root
}

export function countEntries(group: TranslationGroup): number {
  return (
    group.entries.length +
    group.groups.reduce((sum, child) => sum + countEntries(child), 0)
  )
}
