import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/regression',
  timeout: 30_000,
  use: {
    headless: true
  }
});
