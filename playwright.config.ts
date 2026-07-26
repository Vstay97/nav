import { defineConfig, devices } from '@playwright/test'

/**
 * Nav 项目 E2E 基线测试配置
 * - 静态模式（Fork/GitHub Pages）为主
 * - dev server 入口为 /main.html（angular.json index 配置的已知行为）
 */
export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  timeout: 60_000,
  expect: {
    timeout: 15_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:7001',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'yarn start',
    url: 'http://localhost:7001/main.html',
    reuseExistingServer: true,
    timeout: 180_000,
    env: {
      COREPACK_ENABLE_DOWNLOAD_PROMPT: '0',
    },
  },
})
