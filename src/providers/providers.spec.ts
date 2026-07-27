// Copyright @ 2026-present Vstay97. All rights reserved.
import localforage from 'localforage'
import { StaticGitProvider } from './static-git.provider'
import { dataProvider } from './index'
import { STORAGE_KEY_MAP } from 'src/constants'

describe('DataProvider 工厂', () => {
  it('唯一模式：StaticGitProvider（静态 Git 部署）', () => {
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
