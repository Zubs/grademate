import { defineConfig } from '@playwright/test'

const port = 3459

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: `http://localhost:${port}` },
  projects: [
    { name: 'wide', use: { viewport: { width: 1280, height: 800 } } },
    { name: 'phone', use: { viewport: { width: 390, height: 844 }, hasTouch: true } },
  ],
  webServer: {
    command: `npm run build && PORT=${port} node .output/server/index.mjs`,
    url: `http://localhost:${port}`,
    timeout: 240_000,
    reuseExistingServer: true,
  },
})
