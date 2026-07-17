import { createClient } from '@/generated/client/client'
import {
  logout as sdkLogout,
  postLogin,
  postRenew,
} from '@/generated/client/sdk.gen'
import { getTokenExpiry } from '@/lib/jwt'

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

const AUTH_TOKEN_KEY = 'authToken'

let authInitPromise: Promise<void> | null = null
let accessToken: string | null = null
let refreshTimer: ReturnType<typeof setTimeout> | null = null

/** Unauthenticated client — used for login and token renewal. */
export const baseClient = createClient({ baseUrl: API_BASE_URL })

/** Authenticated client — used for all protected API calls. */
export const authenticatedClient = createClient({
  baseUrl: API_BASE_URL,
})

// The generated client only sends an Authorization header for operations with
// an OpenAPI `security` scheme, and this spec doesn't declare one anywhere —
// so we set the header here instead.
authenticatedClient.interceptors.request.use(request => {
  if (accessToken && !request.headers.has('Authorization')) {
    request.headers.set('Authorization', `Bearer ${accessToken}`)
  }
  return request
})

// On 401: refresh token, then retry the original request. Redirect on failure.
let isRefreshing = false
authenticatedClient.interceptors.response.use(async (response, request) => {
  if (response.status === 401 && accessToken && !isRefreshing) {
    isRefreshing = true
    try {
      const refreshed = await refreshToken()
      if (refreshed) {
        request.headers.set('Authorization', `Bearer ${accessToken}`)
        return fetch(request)
      }
      resetAuth()
      window.location.href = '/login'
    } finally {
      isRefreshing = false
    }
  }
  return response
})

export function getAccessToken(): string | null {
  return accessToken
}

function cancelRefresh(): void {
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }
}

/** Schedules a proactive token refresh 2 minutes before expiration. */
export function scheduleRefresh(token: string): void {
  cancelRefresh()
  const expiresIn = getTokenExpiry(token)
  if (!expiresIn || expiresIn <= 0) return
  const refreshIn = Math.max(expiresIn - 2 * 60 * 1000, 0)
  refreshTimer = setTimeout(() => {
    void (async () => {
      const ok = await refreshToken()
      if (!ok) {
        resetAuth()
        window.location.href = '/login'
      }
    })()
  }, refreshIn)
}

export function setAccessToken(token: string | null): void {
  accessToken = token
  if (typeof window === 'undefined') return
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    scheduleRefresh(token)
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    cancelRefresh()
  }
}

function restoreAccessToken(): void {
  if (typeof window === 'undefined') return
  accessToken = localStorage.getItem(AUTH_TOKEN_KEY)
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
      (error as Error | undefined)?.message ?? 'No token received',
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
