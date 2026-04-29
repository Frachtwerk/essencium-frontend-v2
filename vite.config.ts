import { heyApiPlugin, type HeyApiPluginOptions } from '@hey-api/vite-plugin'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const heyApiConfig = {
  config: {
    input: './backend/openapi.yaml',
    output: { path: 'src/generated/client' },
    plugins: ['@tanstack/react-query'],
  },
} satisfies HeyApiPluginOptions

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8098',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api/, ''),
        configure: proxy => {
          // The backend sets the refresh token cookie with `Secure` (HTTPS-only)
          // and `Path=/auth/renew`. Under plain HTTP in dev the browser silently
          // discards the cookie. Strip `Secure` and rewrite the Path so the
          // browser accepts the cookie and the frontend can send it back.
          proxy.on('proxyRes', proxyRes => {
            const setCookie = proxyRes.headers['set-cookie']
            if (setCookie) {
              proxyRes.headers['set-cookie'] = setCookie.map(cookie =>
                cookie
                  .replace(/;\s*Secure/i, '')
                  .replace(/Path=\/auth/i, 'Path=/api/auth'),
              )
            }
          })
        },
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    heyApiPlugin(heyApiConfig),
    tanstackStart({
      spa: {
        enabled: true,
      },
    }),
    tailwindcss(),
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
})
