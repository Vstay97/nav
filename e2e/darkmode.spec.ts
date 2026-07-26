import { test, expect, waitAppReady, stabilize } from './fixtures'

/**
 * 暗黑模式基线
 * - fixbar 展开（预置 FIXBAR_OPEN）→ 点击暗黑按钮 → html 挂 .dark 类
 * - localStorage isDark 写入
 * - 再次点击恢复
 */

test('暗黑模式切换', async ({ appPage: page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('FIXBAR_OPEN', 'true')
  })
  await page.goto('/main.html#/side')
  await waitAppReady(page)
  await stabilize(page)

  const html = page.locator('html')
  await expect(html).not.toHaveClass(/dark/)

  // 点击暗黑切换按钮（月亮图标所在 wrapper）
  const darkBtn = page.locator('.fixbar .wrapper:has(i.icondark)')
  await darkBtn.click()
  await expect(html).toHaveClass(/dark/)
  const isDarkStored = await page.evaluate(() =>
    window.localStorage.getItem('isDark')
  )
  expect(isDarkStored).toBe('1')

  // 暗黑模式截图基线
  await expect(page).toHaveScreenshot('darkmode-side.png', {
    mask: [
      page.locator('app-swiper'),
      page.locator('component-group'),
    ],
  })

  // 再次点击恢复
  const lightBtn = page.locator('.fixbar .wrapper:has(img.icondark)')
  await lightBtn.click()
  await expect(html).not.toHaveClass(/dark/)
})
