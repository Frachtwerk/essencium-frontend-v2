export default {
  '*.{ts,tsx}': ['prettier --write', 'eslint --fix'],
  '*.{mjs,json,md,css}': ['prettier --write'],
}
