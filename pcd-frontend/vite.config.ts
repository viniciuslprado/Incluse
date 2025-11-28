import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy para APIs de CEP que podem ter CORS
      '/api/cep': {
        target: 'https://cdn.apicep.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cep/, ''),
        secure: true
      }
    }
  }
})
