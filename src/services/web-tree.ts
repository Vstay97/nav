// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { IWebProps, INavProps } from 'src/types'
import { navStore } from 'src/store/nav.store'
import { dataProvider } from 'src/providers'
import { queryString } from 'src/utils'

/**
 * 导航树的变更操作（原 src/utils/web.ts，按职责归位到 services）。
 *
 * 模块级函数风格（与 dialogService 一致），不引入 DI：
 * 这些操作组合 NavStore（状态）+ dataProvider（持久化），
 * 被组件/服务/工具函数广泛复用，走 DI 反而增加调用方负担。
 */

/** 更新导航树并持久化：不传参时以 NavStore 当前值为准 */
export function setWebsiteList(v?: INavProps[]): Promise<any> {
  v = v || navStore.websiteList()
  navStore.setWebsiteList(v)
  return dataProvider.saveWebsiteList(v)
}

/** 折叠/展开当前二三级分类下的全部子项，返回折叠后的状态 */
export function toggleCollapseAll(wsList?: INavProps[]): boolean {
  wsList ||= navStore.websiteList()
  const { page, id } = queryString()
  const collapsed = !wsList[page].nav[id].collapsed
  wsList[page].nav[id].collapsed = collapsed
  wsList[page].nav[id].nav.map((item) => {
    item.collapsed = collapsed
    return item
  })
  navStore.touchWebsiteList()
  if (dataProvider.persistUiState) {
    setWebsiteList(wsList)
  }
  return collapsed
}

/**
 * 按 id 从全树删除网站条目。
 * 注意副作用：若当前处于搜索结果页（URL 带 q），删除后整页 reload 重算结果，
 * 因为搜索列表是派生快照，原地删除无法反映到已渲染的搜索结果。
 */
export function deleteByWeb(data: IWebProps): boolean {
  let hasDelete = false
  function f(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (item.name) {
        if (item.id === data.id) {
          hasDelete = true
          arr.splice(i, 1)
          break
        }
        continue
      }

      if (Array.isArray(item.nav)) {
        item.nav = item.nav.filter((w: IWebProps) => {
          if (w.name && w.id === data.id) {
            hasDelete = true
            return false
          }
          return true
        })
        f(item.nav)
      }
    }
  }

  f(navStore.websiteList())
  if (hasDelete) {
    setWebsiteList()
    const { q } = queryString()
    q && window.location.reload()
  }
  return hasDelete
}

/** 按 id 在全树定位网站条目并用 newData 覆盖其字段 */
export function updateByWeb(oldData: IWebProps, newData: IWebProps) {
  const keys = Object.keys(newData)
  let ok = false
  function f(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (item.name) {
        if (item.id === oldData.id) {
          ok = true
          for (let k of keys) {
            ;(item as unknown as Record<string, unknown>)[k] =
              newData[k as keyof IWebProps]
          }
          break
        }
        continue
      }

      if (Array.isArray(item.nav)) {
        f(item.nav)
      }
    }
  }

  f(navStore.websiteList())
  setWebsiteList()
  return ok
}
