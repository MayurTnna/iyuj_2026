import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/iyuj_2026/',
  build: {
    outDir: 'docs',
  },
})
