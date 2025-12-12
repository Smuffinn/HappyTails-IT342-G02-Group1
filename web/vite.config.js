import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ['happytails-web.onrender.com', 'happytails-web-2ym6.onrender.com', 'localhost'],
  },
  server: {
    proxy: {
      // Proxy /api requests to the backend to avoid CORS in dev
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // Proxy /uploads requests to the backend to serve uploaded images
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
