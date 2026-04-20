// Pre-commit: nur Prettier (schnell, zuverlässig, Node-versionsunabhängig).
// ESLint läuft in CI via `pnpm lint`.
export default {
  '*.{ts,tsx,mjs}': ['prettier --write'],
  '*.{json,md,css}': ['prettier --write'],
}
