import {
  test,
  expect,
  waitAppReady,
  stabilize,
  maskLocators,
} from './fixtures'

/**
 * 主题渲染基线
 * - / 通配重定向到默认主题（settings.theme = Side）
 * - 6 个主题均能渲染出网站卡片
 * - 截图基线（外部图片已 stub 为透明图，动态区域已 mask）
 */

const THEMES = ['light', 'sim', 'side', 'super', 'shortcut', 'app'] as const

test('根路径渲染默认主题 Side', async ({ appPage: page }) => {
  // HashLocationStrategy 会将 URL 规范化为 /#/，通配路由直接复用 Side 组件（不做 URL 重定向）
  await page.goto('/main.html')
  await waitAppReady(page)
  await expect(page).toHaveURL(/#\/$/)
  await expect(page.locator('nz-sider')).toBeVisible()
})

for (const theme of THEMES) {
  test(`主题 ${theme} 渲染并截图`, async ({ appPage: page }) => {
    await page.goto(`/main.html#/${theme}`)
    await waitAppReady(page)
    await stabilize(page)

    // 页面应有内容渲染出来（卡片或列表项；shortcut 主题仅展示置顶网站，当前数据无置顶时为空，斾言搜索框）
    if (theme === 'shortcut') {
      await expect(page.locator('#search-engine-input')).toBeVisible()
    } else {
      const cards = page.locator('app-card')
      const webItems = page.locator('.web-list .wrapper')
      const cardsCount = await cards.count()
      const webItemsCount = await webItems.count()
      expect(
        cardsCount + webItemsCount,
        `主题 ${theme} 应渲染出网站条目`
      ).toBeGreaterThan(0)
    }

    await expect(page).toHaveScreenshot(`theme-${theme}.png`, {
      mask: await maskLocators(page),
    })
  })
}
