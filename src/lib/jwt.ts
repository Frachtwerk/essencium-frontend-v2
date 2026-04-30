/**
 * Decodes a JWT payload without verification (verification is done by the backend).
 * Returns milliseconds until the token expires, or null if the exp claim is missing.
 */
export function getTokenExpiry(token: string): number | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const segment = parts[1]
    if (!segment) return null
    const payload = JSON.parse(
      atob(segment.replace(/-/g, '+').replace(/_/g, '/')),
    ) as Record<string, unknown>
    if (typeof payload['exp'] !== 'number') return null
    return payload['exp'] * 1000 - Date.now()
  } catch {
    return null
  }
}
