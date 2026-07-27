import { test, expect, waitAppReady, mockLogin } from './fixtures'

/** 视觉效果层：body 类与极光层/光晕的主题/后台差异 */
test('主题页启用全部特效类', async ({ appPage: page }) => {
  await page.goto('/side')
  await waitAppReady(page)
  const cls = await page.evaluate(() => document.body.className)
  expect(cls).toContain('fx-aurora')
  expect(cls).toContain('fx-glass')
  expect(cls).toContain('fx-tilt')
  expect(cls).toContain('fx-parallax')
  expect(cls).toContain('fx-cursor-glow')
  await expect(page.locator('app-effects-layer')).toHaveCount(1)
  await expect(page.locator('app-cursor-glow')).toHaveCount(1)
})

test('Shortcut 主题豁免极光（保留玻璃与动效）', async ({ appPage: page }) => {
  await page.goto('/shortcut')
  await waitAppReady(page)
  const cls = await page.evaluate(() => document.body.className)
  expect(cls).not.toContain('fx-aurora')
  expect(cls).toContain('fx-glass')
  expect(cls).toContain('fx-tilt')
  expect(cls).toContain('fx-cursor-glow')
  await expect(page.locator('app-effects-layer')).toHaveCount(0)
})

test('后台页面不启用任何特效', async ({ appPage: page }) => {
  await page.goto('/system/web')
  await waitAppReady(page)
  const cls = await page.evaluate(() => document.body.className)
  expect(cls).not.toContain('fx-aurora')
  expect(cls).not.toContain('fx-glass')
  expect(cls).not.toContain('fx-tilt')
  expect(cls).not.toContain('fx-parallax')
  expect(cls).not.toContain('fx-cursor-glow')
  await expect(page.locator('app-effects-layer')).toHaveCount(0)
  await expect(page.locator('app-cursor-glow')).toHaveCount(0)
})

test('设置页存在视觉效果区块', async ({ appPage: page }) => {
  await mockLogin(page)
  await page.goto('/system/setting')
  await waitAppReady(page)
  await expect(page.getByText('视觉效果', { exact: true })).toBeVisible()
  await expect(
    page.locator('label:has-text("极光背景") input[type=checkbox]')
  ).toBeChecked()
})
