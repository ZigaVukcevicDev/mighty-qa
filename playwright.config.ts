import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 20000,
  retries: 0,
  use: {
    baseURL: 'https://app.mightyfields.com',
    headless: true,
    actionTimeout: 10000,
    navigationTimeout: 15000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
});
