/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_URL: string
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production'
  readonly VITE_DEFAULT_USER_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
