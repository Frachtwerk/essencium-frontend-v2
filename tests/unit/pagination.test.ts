import { describe, expect, it } from 'vitest'

import {
  paginationSearchParamsSchema,
  parseSort,
  serializeSort,
} from '@/lib/pagination'

describe('paginationSearchParamsSchema', () => {
  it('applies defaults for an empty object', () => {
    const result = paginationSearchParamsSchema.parse({})
    expect(result).toEqual({ page: 0, size: 10 })
  })

  it('preserves explicit values', () => {
    const result = paginationSearchParamsSchema.parse({ page: 3, size: 25 })
    expect(result).toEqual({ page: 3, size: 25 })
  })

  it('rejects non-number page values', () => {
    expect(() => paginationSearchParamsSchema.parse({ page: 'abc' })).toThrow()
  })

  it('rejects non-number size values', () => {
    expect(() => paginationSearchParamsSchema.parse({ size: 'abc' })).toThrow()
  })
})

describe('parseSort', () => {
  it('returns an empty array when sort is undefined', () => {
    expect(parseSort(undefined)).toEqual([])
  })

  it('returns an empty array when sort is an empty string', () => {
    expect(parseSort('')).toEqual([])
  })

  it('parses ascending sort', () => {
    expect(parseSort('name,asc')).toEqual([{ id: 'name', desc: false }])
  })

  it('parses descending sort', () => {
    expect(parseSort('name,desc')).toEqual([{ id: 'name', desc: true }])
  })
})

describe('serializeSort', () => {
  it('returns undefined for an empty array', () => {
    expect(serializeSort([])).toBeUndefined()
  })

  it('serializes ascending sort', () => {
    expect(serializeSort([{ id: 'name', desc: false }])).toBe('name,asc')
  })

  it('serializes descending sort', () => {
    expect(serializeSort([{ id: 'name', desc: true }])).toBe('name,desc')
  })

  it('round-trips: parse then serialize returns original string', () => {
    const original = 'email,desc'
    const parsed = parseSort(original)
    const serialized = serializeSort(parsed)
    expect(serialized).toBe(original)
  })
})
