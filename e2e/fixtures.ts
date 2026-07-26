import { test as base, expect, Page, Route } from '@playwright/test'

/**
 * E2E 公共基础设施
 *
 * 1. stubExternalRequests: 拦截一切非 localhost 请求
 *    - GitHub API → mock JSON
 *    - 图片 → 1x1 透明 PNG（保证截图基线稳定）
 *    - 样式（unpkg dark css 等）→ 空 CSS
 *    - 其余（api.nav3.cn、天气 iframe 等）→ 空 JSON
 * 2. stabilize: 屏蔽随时间/随机变化的视觉元素
 * 3. waitAppReady: 等待应用数据加载完成（window.__FINISHED__）
 */

// 按用途分档的 stub 图片（避免破坏布局比例）
const svgStub = (w: number, h: number, color = '#e8e8e8') =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="${color}"/></svg>`
  )
const BANNER_SVG = svgStub(1200, 400) // 轮播 banner 比例
const SQUARE_SVG = svgStub(300, 300) // 广告位/favicon 通用
const BADGE_SVG = svgStub(104, 20, '#e05d44') // shields.io 徽章

function stubImageFor(url: string): Buffer {
  if (url.includes('shields.io')) return BADGE_SVG
  if (/banner|background|component\d/i.test(url)) return BANNER_SVG
  return SQUARE_SVG
}

const LOCAL_ORIGIN = 'http://localhost:7001'

export async function stubExternalRequests(page: Page) {
  await page.route('**', (route: Route) => {
    const url = route.request().url()
    if (
      url.startsWith(LOCAL_ORIGIN) ||
      url.startsWith('data:') ||
      url.startsWith('blob:') ||
      url.startsWith('about:')
    ) {
      return route.continue()
    }
    if (url.startsWith('https://api.github.com')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ login: 'e2e-mock', sha: 'e2e-mock-sha' }),
      })
    }
    const type = route.request().resourceType()
    if (type === 'image') {
      return route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: stubImageFor(url),
      })
    }
    if (type === 'stylesheet') {
      return route.fulfill({ status: 200, contentType: 'text/css', body: '' })
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{}',
    })
  })
}

/** 隐藏随机/时间相关视觉元素，保证截图可复现 */
export async function stabilize(page: Page) {
  await page
    .addStyleTag({
      content: `
        #random-light-bg { display: none !important; }
        * {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          caret-color: transparent !important;
        }
      `,
    })
    .catch(() => {})
}

/** 等待应用异步数据加载完成 */
export async function waitAppReady(page: Page) {
  await page.waitForFunction(() => (window as any).__FINISHED__ === true, {
    timeout: 30_000,
  })
}

/** 截图时需要 mask 的动态区域（轮播、时钟、日期相关组件等） */
export const DYNAMIC_MASKS = [
  'app-swiper', // 轮播（autoplay 随时间切换）
  '.datetime', // shortcut 时钟
  '.days', // shortcut 日期
  '.tianqi', // shortcut 天气 iframe
  'component-group', // 日历/倒计时/下班/运行时长组件（随日期时间变化）
]

export async function maskLocators(page: Page) {
  const locators = []
  for (const sel of DYNAMIC_MASKS) {
    locators.push(page.locator(sel))
  }
  return locators
}

/** 模拟登录态：预置 token（isLogin 在模块加载时读取 localStorage） */
export async function mockLogin(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem('token', 'e2e-fake-token')
  })
}

/** 移除登录后可能出现的"构建成功"常驻通知 */
export async function dismissNotifications(page: Page) {
  await page
    .evaluate(() => {
      document
        .querySelectorAll('.ant-notification')
        .forEach((el) => el.remove())
    })
    .catch(() => {})
}

type Fixtures = {
  appPage: Page
}

export const test = base.extend<Fixtures>({
  appPage: async ({ page }, use) => {
    await stubExternalRequests(page)
    await use(page)
  },
})

export { expect }
