import { test, expect, waitAppReady } from './fixtures'

/**
 * 导航交互基线（基于默认 Side 主题）
 * - 二级分类切换：URL query (page/id) 变化 + 卡片列表更新
 * - 一级分类切换
 * - 折叠/展开
 */

test.describe('Side 主题导航', () => {
  test.beforeEach(async ({ appPage: page }) => {
    await page.goto('/main.html#/side')
    await waitAppReady(page)
  })

  test('二级分类切换更新 URL 与内容', async ({ appPage: page }) => {
    // 数据干净时一级分类默认收起，先展开第一个一级分类
    const firstSubMenu = page.locator('nz-sider li[nz-submenu]').first()
    await firstSubMenu.locator('.ant-menu-submenu-title').click()

    const menuItems = firstSubMenu.locator('li[nz-menu-item]')
    const count = await menuItems.count()
    expect(count, '第一个一级分类下应有多个二级分类').toBeGreaterThan(1)

    // 点击第二个二级分类（避免依赖具体文案）
    await menuItems.nth(1).click()
    await expect(page).toHaveURL(/[?&]id=1(&|$)/)

    // 卡片列表应渲染
    await expect(page.locator('app-card').first()).toBeVisible()
  })

  test('一级分类切换更新 URL', async ({ appPage: page }) => {
    const subMenus = page.locator('nz-sider li[nz-submenu]')
    const count = await subMenus.count()
    expect(count, '侧边栏应有多个一级分类').toBeGreaterThan(1)

    // 展开第二个一级分类并点击其第一个二级分类
    const second = subMenus.nth(1)
    await second.locator('.ant-menu-submenu-title').click()
    const childItem = second.locator('li[nz-menu-item]').first()
    await childItem.click()
    await expect(page).toHaveURL(/[?&]page=1(&|$)/)
    await expect(page.locator('app-card').first()).toBeVisible()
  })

  test('分类折叠与展开', async ({ appPage: page }) => {
    // 展开第一个一级分类并进入其第一个二级分类
    const firstSubMenu = page.locator('nz-sider li[nz-submenu]').first()
    await firstSubMenu.locator('.ant-menu-submenu-title').click()
    await firstSubMenu.locator('li[nz-menu-item]').first().click()

    const firstGroupRow = page
      .locator('.nav-wrapper [nz-row], .box [nz-row]')
      .first()
    await expect(firstGroupRow).toBeVisible()

    // 点击第一个分组标题的折叠按钮
    const collapseBtn = page
      .locator('app-toolbar-title .collapse, app-toolbar-title .title-icon, app-toolbar-title i')
      .first()
    await collapseBtn.click()
    await expect(firstGroupRow).toBeHidden()

    // 再次点击展开
    await collapseBtn.click()
    await expect(firstGroupRow).toBeVisible()
  })
})
