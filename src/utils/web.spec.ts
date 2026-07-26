import {
  adapterWebsiteList,
  deleteByWeb,
  updateByWeb,
  toggleCollapseAll,
} from './web'
import { navStore } from 'src/store/nav.store'
import { IWebProps } from 'src/types'

function buildWeb(over: Partial<IWebProps> = {}): IWebProps {
  return {
    id: 'w-1',
    name: '站点A',
    desc: '描述A',
    url: 'https://a.com',
    icon: '',
    createdAt: '',
    breadcrumb: [],
    tags: [],
    ...over,
  } as IWebProps
}

function buildTree(): any[] {
  return [
    {
      title: '一级',
      nav: [
        {
          title: '二级',
          nav: [
            {
              title: '三级',
              nav: [buildWeb({ id: 'w-1' }), buildWeb({ id: 'w-2' })],
            },
          ],
        },
      ],
    },
  ]
}

describe('adapterWebsiteList', () => {
  it('未登录时过滤 ownVisible 项（各层级）', () => {
    const tree = buildTree()
    tree[0].ownVisible = true // 一级整组应被过滤
    const second = buildTree()
    second[0].nav[0].nav[0].nav[0].ownVisible = true // 仅过滤三级下的单个网站

    const resultA = adapterWebsiteList(tree)
    expect(resultA.length).toBe(0)

    const resultB = adapterWebsiteList(second)
    const webs = resultB[0].nav[0].nav[0].nav
    expect(webs.length).toBe(1)
    expect(webs[0].id).toBe('w-2')
  })

  it('无 ownVisible 时原样保留', () => {
    const tree = buildTree()
    const result = adapterWebsiteList(tree)
    expect(result[0].nav[0].nav[0].nav.length).toBe(2)
  })
})

describe('deleteByWeb / updateByWeb（操作全局 websiteList）', () => {
  let snapshot: string

  beforeEach(() => {
    snapshot = JSON.stringify(navStore.websiteList())
    window.history.pushState({}, '', window.location.pathname)
  })

  afterEach(() => {
    navStore.setWebsiteList(JSON.parse(snapshot))
    window.history.pushState({}, '', window.location.pathname)
  })

  it('deleteByWeb 按 id 删除并返回 true', () => {
    const target = navStore.websiteList()[0].nav[0].nav[0].nav[0] as IWebProps
    const before = JSON.stringify(navStore.websiteList())
    const ok = deleteByWeb({ ...target })
    expect(ok).toBe(true)
    expect(JSON.stringify(navStore.websiteList())).not.toBe(before)
    // 再删一次返回 false
    expect(deleteByWeb({ ...target })).toBe(false)
  })

  it('updateByWeb 按 id 更新字段', () => {
    const target = navStore.websiteList()[0].nav[0].nav[0].nav[0] as IWebProps
    const ok = updateByWeb({ ...target }, {
      ...target,
      name: '已改名E2E单元',
    } as IWebProps)
    expect(ok).toBe(true)
    const after = navStore.websiteList()[0].nav[0].nav[0].nav[0] as IWebProps
    expect(after.name).toBe('已改名E2E单元')
  })

  it('toggleCollapseAll 折叠/展开当前二级分类', () => {
    window.localStorage.setItem(
      'location',
      JSON.stringify({ page: 0, id: 0 })
    )
    const node = navStore.websiteList()[0].nav[0]
    const before = !!node.collapsed
    const now = toggleCollapseAll()
    expect(now).toBe(!before)
    expect(!!navStore.websiteList()[0].nav[0].collapsed).toBe(!before)
    // 三级分组同步折叠状态
    for (const three of navStore.websiteList()[0].nav[0].nav) {
      expect(!!three.collapsed).toBe(!before)
    }
    // 还原
    toggleCollapseAll()
    expect(!!navStore.websiteList()[0].nav[0].collapsed).toBe(before)
  })
})
