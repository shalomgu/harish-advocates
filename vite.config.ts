import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` must match the GitHub Pages project path the app is served from.
// Final home is the existing repo -> https://shalomgu.github.io/harish-advocates/
// Override at build time with: VITE_BASE=/h-a-2/ npm run build
export default defineConfig(() => ({
  base: process.env.VITE_BASE ?? '/harish-advocates/',
  plugins: [react()],
}))
