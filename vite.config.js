import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // All config here is related to production build only
  build: {
    outDir: 'build',
    sourcemap: false, // Disable source maps for production
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined, // Prevent chunk splitting issues
      }
    }
  }
})
