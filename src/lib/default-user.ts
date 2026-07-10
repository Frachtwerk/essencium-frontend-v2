/**
 * The preset default user (seeded by the backend) must not be edited or
 * deleted. It is identified by its email via `VITE_DEFAULT_USER_EMAIL`.
 *
 * This is a client-side convenience guard for the UI — the backend remains the
 * source of truth and rejects modifying or deleting the default user.
 */
export function isDefaultUser(email: string | null | undefined): boolean {
  const defaultEmail = import.meta.env.VITE_DEFAULT_USER_EMAIL
  if (!defaultEmail || !email) return false
  return email.toLowerCase() === defaultEmail.toLowerCase()
}
