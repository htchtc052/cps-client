import { defineConfig, devices } from '@playwright/test'

// The suite drives the frontend the architect already runs; it never starts one.
export default defineConfig({
  testDir: 'tests',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
