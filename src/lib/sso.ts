export function isSsoManaged(ssoProvider: string | undefined): boolean {
  return Boolean(ssoProvider && ssoProvider.toUpperCase() !== 'LOCAL')
}
