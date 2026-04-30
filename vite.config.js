import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        target: 'https://backend-com.up.railway.app',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          // Forward Set-Cookie headers from backend back to browser
          proxy.on('proxyRes', (proxyRes) => {
            const setCookie = proxyRes.headers['set-cookie']
            if (setCookie) {
              // Rewrite cookie domain so browser accepts it on localhost:5173
              proxyRes.headers['set-cookie'] = setCookie.map((cookie) =>
                cookie
                  .replace(/;\s*domain=[^;]+/gi, '')
                  .replace(/;\s*secure/gi, '')
              )
            }
          })
        },
      },
      '/api': {
        target: 'https://backend-com.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})