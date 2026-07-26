import { fuzzySearch, queryString } from './index'
import { SearchType } from 'src/components/search-engine/index'
import { INavProps } from 'src/types'

/** 构造三级导航测试数据（fuzzySearch 会原地修改匹配项，需每次重建） */
function buildNavList(): INavProps[] {
  const web = (over: Partial<any> = {}) => ({
    id: 'w1',
    name: 'GitHub 加速',
    desc: '加速下载',
    url: 'https://ghproxy.com',
    icon: '',
    createdAt: '',
    breadcrumb: [],
    tags: [],
    ...over,
  })
  return [
    {
      title: '一级A',
      nav: [
        {
          title: '二级A1',
          nav: [
            {
              title: '三级A11',
              nav: [web()],
            },
          ],
        },
      ],
    },
  ] as unknown as INavProps[]
}

function setUrl(search: string) {
  window.history.pushState({}, '', `${window.location.pathname}${search}`)
}

describe('queryString', () => {
  afterEach(() => {
    window.localStorage.clear()
    setUrl('')
  })

  it('解析 URL 中的 page/id/q', () => {
    // websiteList[0] 含 4 个二级分类，id=2 在有效范围内
    setUrl('?page=0&id=2&q=hello')
    const r = queryString()
    expect(r.page).toBe(0)
    expect(r.id).toBe(2)
    expect(r.q).toBe('hello')
  })

  it('id 超出当前 page 分类数时回退到末位', () => {
    // websiteList[1] 仅有 1 个二级分类，id=5 越界 → 回退到 0
    setUrl('?page=1&id=5')
    const r = queryString()
    expect(r.page).toBe(1)
    expect(r.id).toBe(0)
  })

  it('无参数时回退 localStorage location', () => {
    window.localStorage.setItem(
      'location',
      JSON.stringify({ page: 0, id: 0 })
    )
    setUrl('')
    const r = queryString()
    expect(r.page).toBe(0)
    expect(r.id).toBe(0)
  })

  it('page 越界时回退到 0', () => {
    setUrl('?page=999&id=0')
    const r = queryString()
    expect(r.page).toBe(0)
    expect(r.id).toBe(0)
  })

  it('负数参数归一化为 0', () => {
    setUrl('?page=-3&id=-1')
    const r = queryString()
    expect(r.page).toBe(0)
    expect(r.id).toBe(0)
  })
})

describe('fuzzySearch', () => {
  afterEach(() => {
    setUrl('')
  })

  it('空关键词返回空数组', () => {
    setUrl('')
    expect(fuzzySearch(buildNavList(), '  ')).toEqual([])
  })

  it('按标题搜索并高亮', () => {
    setUrl(`?type=${SearchType.Title}`)
    const result = fuzzySearch(buildNavList(), 'github')
    expect(result.length).toBe(1)
    expect(result[0].nav.length).toBe(1)
    expect(result[0].nav[0].name).toContain('<b>')
    expect(result[0].nav[0].__name__).toBe('GitHub 加速')
  })

  it('标题无匹配时返回空', () => {
    setUrl(`?type=${SearchType.Title}`)
    expect(fuzzySearch(buildNavList(), '不存在xyz')).toEqual([])
  })

  it('按描述搜索并高亮', () => {
    setUrl(`?type=${SearchType.Desc}`)
    const result = fuzzySearch(buildNavList(), '加速下载')
    expect(result.length).toBe(1)
    expect(result[0].nav[0].desc).toContain('<b>')
    expect(result[0].nav[0].__desc__).toBe('加速下载')
  })

  it('按 URL 搜索', () => {
    setUrl(`?type=${SearchType.Url}`)
    const result = fuzzySearch(buildNavList(), 'ghproxy')
    expect(result.length).toBe(1)
    expect(result[0].nav[0].id).toBe('w1')
  })

  it('Quick 模式仅匹配 top 项', () => {
    setUrl(`?type=${SearchType.Quick}`)
    expect(fuzzySearch(buildNavList(), 'github')).toEqual([])
    const list = buildNavList()
    ;(list[0].nav[0].nav[0].nav[0] as any).top = true
    const result = fuzzySearch(list, 'github')
    expect(result.length).toBe(1)
  })

  it('All 模式综合匹配标题/描述/URL', () => {
    setUrl(`?type=${SearchType.All}`)
    expect(fuzzySearch(buildNavList(), 'github').length).toBe(1)
    expect(fuzzySearch(buildNavList(), '加速下载').length).toBe(1)
    expect(fuzzySearch(buildNavList(), 'ghproxy').length).toBe(1)
  })

  it('URL 无 type 参数时按 Title 模式匹配（现有行为）', () => {
    setUrl('')
    expect(fuzzySearch(buildNavList(), 'github').length).toBe(1)
    expect(fuzzySearch(buildNavList(), '加速下载')).toEqual([])
  })

  it('搜索结果去重（同 id 不重复收录）', () => {
    setUrl('')
    const list = buildNavList()
    // 复制一个相同 id 的网站
    const dup = { ...list[0].nav[0].nav[0].nav[0] }
    ;(list[0].nav[0].nav[0].nav as any[]).push(dup)
    const result = fuzzySearch(list, 'github')
    expect(result[0].nav.length).toBe(1)
  })
})
