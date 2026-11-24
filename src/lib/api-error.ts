/**
 * A failed API call, reduced to its HTTP status. Pages pick their own i18n
 * text from the status — backend messages are never shown. `status` is
 * undefined when no response arrived (network error).
 */
export class ApiError extends Error {
  readonly status: number | undefined

  constructor(status: number | undefined) {
    super(`API request failed with status ${status ?? 'none'}`)
    this.name = 'ApiError'
    this.status = status
  }
}
