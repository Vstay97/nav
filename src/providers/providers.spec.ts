import localforage from 'localforage'
import { StaticGitProvider } from './static-git.provider'
import { SelfHostProvider } from './self-host.provider'
import { dataProvider } from './index'
import { STORAGE_KEY_MAP } from 'src/constants'

describe('DataProvider 工厂', () => {
  it('address 为空（静态模式）时选择 StaticGitProvider', () => {
    // 当前 nav.config.yaml address 为空 → 静态模式
    expect(dataProvider instanceof StaticGitProvider).toBe(true)
  })
})

describe('StaticGitProvider', () => {
  it('persistUiState = true（折叠状态持久化到 localforage）', () => {
    const p = new StaticGitProvider()
    expect(p.persistUiState).toBe(true)
  })

  it('saveWebsiteList 写入 localforage', async () => {
    // spy 避免与其他 spec 共享 localforage 产生异步竞争
    const spy = spyOn(localforage, 'setItem').and.resolveTo(null as any)
    const p = new StaticGitProvider()
    const list: any[] = [{ title: '测试分类', nav: [] }]
    await p.saveWebsiteList(list as any)
    expect(spy).toHaveBeenCalledWith(STORAGE_KEY_MAP.website, list as any)
  })

  it('createBranch 在配置 imageRepoUrl 时为 no-op', async () => {
    // 当前 nav.config.yaml 配置了 imageRepoUrl → createBranch 直接返回
    const p = new StaticGitProvider()
    const res = await p.createBranch('image')
    expect(res).toBeUndefined()
  })
})

describe('SelfHostProvider', () => {
  it('persistUiState = false（折叠状态不写服务端）', () => {
    const p = new SelfHostProvider()
    expect(p.persistUiState).toBe(false)
  })

  it('createBranch 为 no-op（自有部署无 Git 分支概念）', async () => {
    const p = new SelfHostProvider()
    await expectAsync(p.createBranch('image')).toBeResolved()
  })

  it('未登录时 updateFileContent 直接 resolve（不发请求）', async () => {
    const p = new SelfHostProvider()
    // Karma 环境 localStorage 无 token → isLogin=false → no-op
    await expectAsync(
      p.updateFileContent({ content: '{}', path: 'data/db.json' })
    ).toBeResolved()
  })
})
