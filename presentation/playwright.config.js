import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.e2e.js',
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:5220/rabobank-copilot-workshop/', viewport: { width: 1440, height: 900 } },
  webServer: {
    command: process.env.SKIP_BUILD ? 'npm run preview' : 'npm run build && npm run preview',
    url: 'http://127.0.0.1:5220/rabobank-copilot-workshop/',
    reuseExistingServer: false,
    timeout: 180000,
  },
})
