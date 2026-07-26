import { IWebProps, INavProps } from '../types'
import { navStore } from 'src/store/nav.store'
import { dataProvider } from 'src/providers'
import { queryString } from './index'

export function setWebsiteList(v?: INavProps[]): Promise<any> {
  v = v || navStore.websiteList()
  navStore.setWebsiteList(v)
  return dataProvider.saveWebsiteList(v)
}

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
    // 在搜索结果删除需要刷新重新刷结果
    q && window.location.reload()
  }
  return hasDelete
}

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
