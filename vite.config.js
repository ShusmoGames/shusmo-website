import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import routeStubs from './vite-plugin-route-stubs.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), routeStubs()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
})
