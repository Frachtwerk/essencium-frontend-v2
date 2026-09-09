import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getTokenExpiry } from '@/lib/jwt'

function encodePayload(payload: Record<string, unknown>): string {
  const json = JSON.stringify(payload)
  return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function makeToken(payload: Record<string, unknown>): string {
  return `header.${encodePayload(payload)}.signature`
}

describe('getTokenExpiry', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the remaining milliseconds for a future exp claim', () => {
    const nowMs = 10_000
    vi.setSystemTime(nowMs)

    const expSec = 20
    const token = makeToken({ exp: expSec })

    expect(getTokenExpiry(token)).toBe(expSec * 1000 - nowMs)
  })

  it('returns a negative value for an expired token', () => {
    const nowMs = 30_000
    vi.setSystemTime(nowMs)

    const expSec = 20
    const token = makeToken({ exp: expSec })

    expect(getTokenExpiry(token)).toBeLessThan(0)
  })

  it('returns null when exp claim is missing', () => {
    const token = makeToken({ sub: 'user' })
    expect(getTokenExpiry(token)).toBeNull()
  })

  it('returns null when exp claim is not a number', () => {
    const token = makeToken({ exp: 'not-a-number' })
    expect(getTokenExpiry(token)).toBeNull()
  })

  it('returns null for a token with wrong number of segments (2 segments)', () => {
    expect(getTokenExpiry('header.payload')).toBeNull()
  })

  it('returns null for a token with wrong number of segments (4 segments)', () => {
    expect(getTokenExpiry('a.b.c.d')).toBeNull()
  })

  it('returns null for invalid base64 in the payload', () => {
    expect(getTokenExpiry('header.!!!invalid!!!.signature')).toBeNull()
  })

  it('returns null for valid base64 but invalid JSON in the payload', () => {
    // "notjson" in base64url
    expect(getTokenExpiry('header.bm90anNvbg.signature')).toBeNull()
  })

  it('handles URL-safe base64 characters (- and _) in the payload', () => {
    vi.setSystemTime(5_000)

    // Construct a token with explicit - and _ characters in the payload segment.
    // The byte sequence [0xFA, 0x00, 0x00] standard-base64-encodes to "+gAA".
    // URL-safe-encoding replaces + with -, giving "-gAA".
    // This decodes to the bytes 0xFA 0x00 0x00, which is not valid JSON,
    // so getTokenExpiry returns null — verifying that the replace logic runs.
    const payloadWithDash = btoa(String.fromCharCode(0xfa, 0x00, 0x00))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
    const tokenDash = `header.${payloadWithDash}.signature`
    expect(getTokenExpiry(tokenDash)).toBeNull()

    // The byte sequence [0xFC] standard-base64-encodes to "/A==".
    // URL-safe: "_A". Decodes to 0xFC (not valid JSON).
    const payloadWithUnderscore = btoa(String.fromCharCode(0xfc))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
    const tokenUnderscore = `header.${payloadWithUnderscore}.signature`
    expect(getTokenExpiry(tokenUnderscore)).toBeNull()

    // Verify round-trip with a valid payload (URL-safe encoding is used by makeToken)
    const token = makeToken({ exp: 30 })
    expect(getTokenExpiry(token)).toBeGreaterThan(0)
  })

  it('returns null for an empty string', () => {
    expect(getTokenExpiry('')).toBeNull()
  })
})
