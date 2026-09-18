import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    host: true,  // Keep this
    allowedHosts: [
      'notal-ellyn-brineless.ngrok-free.dev',  // Add your specific ngrok domain
      '.ngrok-free.dev',  // This allows ALL ngrok-free.dev subdomains
      'localhost'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
