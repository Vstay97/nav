import {
  test,
  expect,
  waitAppReady,
  stabilize,
  mockLogin,
  dismissNotifications,
} from './fixtures'

/**
 * 系统管理后台基线（静态模式 + mock 登录态 + mock GitHub API）
 * - /system/web 网站管理页渲染
 * - /system/tag 标签页渲染
 * - /system/search 搜索引擎页渲染
 * - /system/setting 设置页渲染
 */

test.describe('系统管理后台', () => {
  test.beforeEach(async ({ appPage: page }) => {
    await mockLogin(page)
  })

  const PAGES = [
    { path: 'web', name: '网站管理' },
    { path: 'tag', name: '标签管理' },
    { path: 'search', name: '搜索引擎管理' },
    { path: 'setting', name: '设置' },
  ] as const

  for (const { path, name } of PAGES) {
    test(`${name} /system/${path} 渲染并截图`, async ({ appPage: page }) => {
      await page.goto(`/system/${path}`)
      await waitAppReady(page)

      // 等待页内容实际渲染（登录态有清缓存等异步流程；排除 nz-table 的“暂无数据”占位行，避免捕获空态）
      await expect(
        page.locator('.ant-table-tbody tr:not(.ant-table-placeholder), form').first()
      ).toBeVisible()
      await stabilize(page)
      await dismissNotifications(page)

      await expect(page).toHaveScreenshot(`system-${path}.png`, {
        mask: [page.locator('component-group')],
      })
    })
  }

  test('菜单：企业级入口已解锁，上游授权入口已移除', async ({ appPage: page }) => {
    await page.goto('/system/web')
    await waitAppReady(page)
    const menu = page.locator('.sider-menu')
    await expect(menu.getByText('小组件')).toBeVisible()
    await expect(menu.getByText('书签导出')).toBeVisible()
    await expect(menu.getByText('用户收录')).toHaveCount(0)
    await expect(menu.getByText('绑定域名')).toHaveCount(0)
  })

  test('书签导出页渲染', async ({ appPage: page }) => {
    await page.goto('/system/bookmarkExport')
    await waitAppReady(page)
    await expect(page.locator('.book-wrapper')).toBeVisible()
  })
})

// 注意：此测试不可放在上方 describe 内（beforeEach 会注入登录态）
test('未登录访问 /system 不渲染后台内容', async ({ appPage: page }) => {
  await page.goto('/system/web')
  await page.waitForTimeout(2000)
  // 未登录时后台布局不渲染（*ngIf="isLogin"），仅显示登录框（nz-modal 弹层）
  await expect(page.locator('nz-layout.system-layout')).toHaveCount(0)
  await expect(page.locator('#loginInput')).toBeVisible()
})
