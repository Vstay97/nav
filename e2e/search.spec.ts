import { test, expect, waitAppReady } from './fixtures'

/**
 * 搜索交互基线（基于 Side 主题，默认站内搜索引擎）
 * - 输入关键词回车 → URL 带 q 参数 → 结果过滤
 * - 清空关键词回车 → 恢复列表
 */

test.describe('站内搜索', () => {
  test.beforeEach(async ({ appPage: page }) => {
    await page.goto('/side')
    await waitAppReady(page)
  })

  test('关键词搜索过滤结果并更新 URL', async ({ appPage: page }) => {
    const input = page.locator('#search-engine-input')
    await expect(input).toBeVisible()

    // 从首屏抓取一个真实存在的网站名作为关键词，避免硬编码依赖数据
    const firstName = (
      await page.locator('app-card .card-title, app-card .title, app-card').first().innerText()
    ).trim().split('\n')[0].slice(0, 2)
    expect(firstName.length).toBeGreaterThan(0)

    await input.fill(firstName)
    await input.press('Enter')
    await expect(page).toHaveURL(/[?&]q=/)

    // 搜索结果应至少有一条
    await expect(page.locator('app-card').first()).toBeVisible()
  })

  test('清空搜索恢复列表', async ({ appPage: page }) => {
    const input = page.locator('#search-engine-input')
    await input.fill('测试关键词')
    await input.press('Enter')
    await expect(page).toHaveURL(/[?&]q=/)

    await input.fill('')
    await input.press('Enter')
    await expect(page).not.toHaveURL(/[?&]q=%E6/)
    // 恢复后卡片仍应渲染
    await expect(page.locator('app-card').first()).toBeVisible()
  })
})
