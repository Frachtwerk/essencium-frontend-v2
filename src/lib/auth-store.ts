import { createClient } from '@/generated/client/client'
import {
  getMe,
  logout as sdkLogout,
  postLogin,
  postRenew,
} from '@/generated/client/sdk.gen'

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

const AUTH_TOKEN_KEY = 'authToken'

let authInitPromise: Promise<void> | null = null
let accessToken: string | null = null

/** Unauthenticated client — used for login and token renewal. */
export const baseClient = createClient({ baseUrl: API_BASE_URL })

/**
 * Authenticated client — used for all protected API calls.
 * The token is resolved dynamically at request time via the `auth` callback.
 */
export const authenticatedClient = createClient({
  baseUrl: API_BASE_URL,
  auth: () => accessToken ?? undefined,
})

authenticatedClient.interceptors.request.use(request => {
  if (accessToken) {
    request.headers.set('Authorization', `Bearer ${accessToken}`)
  }
  return request
})

// On 401: attempt a single token refresh, then redirect to /login on failure.
let isRefreshing = false
authenticatedClient.interceptors.response.use(async response => {
  if (response.status === 401 && accessToken && !isRefreshing) {
    isRefreshing = true
    try {
      const refreshed = await refreshToken()
      if (!refreshed) {
        resetAuth()
        window.location.href = '/login'
      }
    } finally {
      isRefreshing = false
    }
  }
  return response
})

export function getAccessToken(): string | null {
  return accessToken
}

export function setAccessToken(token: string | null): void {
  accessToken = token
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(token))
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }
}

function restoreAccessToken(): void {
  try {
    const stored = localStorage.getItem(AUTH_TOKEN_KEY)
    accessToken = stored ? (JSON.parse(stored) as string) : null
  } catch {
    accessToken = null
  }
}

export async function refreshToken(): Promise<boolean> {
  try {
    const { data } = await postRenew({
      client: baseClient,
      credentials: 'include',
      headers: {
        'User-Agent': navigator.userAgent,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    })
    if (data?.token) {
      setAccessToken(data.token)
      return true
    }
    return false
  } catch {
    return false
  }
}

export async function login(
  username: string,
  password: string,
): Promise<string> {
  const { data, error } = await postLogin({
    client: baseClient,
    body: { username, password },
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })

  if (error || !data?.token) {
    throw new Error(
      'Login fehlgeschlagen: ' +
        ((error as Error | undefined)?.message ?? 'Kein Token erhalten'),
    )
  }

  setAccessToken(data.token)
  return data.token
}

export async function logout(): Promise<void> {
  try {
    await sdkLogout({
      client: authenticatedClient,
      credentials: 'include',
      headers: { Authorization: '' },
    })
  } catch {
    // Backend logout may fail — ignore, clear token regardless
  } finally {
    setAccessToken(null)
  }
}

/**
 * Called once at app startup: restores the token from storage and attempts
 * a silent refresh. Route guards await `waitForAuth()` before checking the
 * token so the user is never wrongly redirected to /login on a hard reload.
 */
export function initAuth(): Promise<void> {
  if (!authInitPromise) {
    authInitPromise = (async () => {
      restoreAccessToken()
      if (!accessToken) return
      try {
        const refreshed = await refreshToken()
        if (!refreshed) setAccessToken(null)
      } catch {
        setAccessToken(null)
      }
    })()
  }
  return authInitPromise
}

/** Awaited by route `beforeLoad` guards so they run after auth is initialised. */
export function waitForAuth(): Promise<void> {
  return authInitPromise ?? Promise.resolve()
}

export function resetAuth(): void {
  authInitPromise = null
  setAccessToken(null)
}

/** Convenience: fetches the current user without a token (used for type-only imports). */
export { getMe }
