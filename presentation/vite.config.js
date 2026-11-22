import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/rabobank-copilot-workshop/',
  plugins: [react({ include: [/\.[jt]sx?$/, /node_modules\/@deckio\/deck-engine\/.+\.jsx$/] })],
  server: { host: '127.0.0.1', port: 5219, strictPort: true },
  preview: { host: '127.0.0.1', port: 5220, strictPort: true },
})
