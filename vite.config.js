```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Ensure proper base path for assets
  base: '',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Enable source maps for debugging
    sourcemap: true,
    // Ensure assets are properly hashed
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'react-hot-toast'],
          icons: ['react-icons']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    open: true
  },
  preview: {
    port: 4173,
    host: true,
    open: true
  }
})
```