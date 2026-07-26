// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { INavProps, INavThreeProp, IWebProps, IWebTag } from '../types'
import { SearchType } from 'src/components/search-engine/index'
import { queryString } from './query.util'
import { getTextContent } from './text.util'

export function fuzzySearch(
  navList: INavProps[],
  keyword: string
): INavThreeProp[] {
  if (!keyword.trim()) {
    return []
  }

  const { type, page, id } = queryString()
  const sType = Number(type) || SearchType.Title
  const navData: IWebProps[] = []
  const resultList: INavThreeProp[] = [{ nav: navData }]
  const urlRecordMap: Record<string, any> = {}

  function f(arr?: any[]) {
    arr = arr || navList

    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (Array.isArray(item.nav)) {
        f(item.nav)
      }

      if (item.name) {
        item.name = getTextContent(item.name)
        item.desc = getTextContent(item.desc)
        const name = item.name.toLowerCase()
        const desc = item.desc.toLowerCase()
        const url = item.url.toLowerCase()
        const search = keyword.toLowerCase()

        const searchTitle = (): boolean => {
          if (name.includes(search)) {
            let result = item
            const regex = new RegExp(`(${keyword})`, 'i')
            result.__name__ = result.name
            result.name = result.name.replace(regex, '<b>$1</b>')

            if (!urlRecordMap[result.id]) {
              urlRecordMap[result.id] = true
              navData.push(result)
              return true
            }
          }
          return false
        }

        const searchUrl = () => {
          if (url?.includes?.(search)) {
            if (!urlRecordMap[item.id]) {
              urlRecordMap[item.id] = true
              navData.push(item)
              return true
            }
          }

          const find = item.tags.some((item: IWebTag) =>
            item.url?.includes(keyword)
          )
          if (find) {
            if (!urlRecordMap[item.id]) {
              urlRecordMap[item.id] = true
              navData.push(item)
              return true
            }
          }
        }

        const searchDesc = (): boolean => {
          if (desc[0] === '!') {
            return false
          }
          if (desc.includes(search)) {
            let result = item
            const regex = new RegExp(`(${keyword})`, 'i')
            result.__desc__ = result.desc
            result.desc = result.desc.replace(regex, '<b>$1</b>')

            if (!urlRecordMap[result.id]) {
              urlRecordMap[result.id] = true
              navData.push(result)
              return true
            }
          }
          return false
        }

        const searchQuick = (): boolean => {
          if (item.top && name.includes(search)) {
            let result = item
            const regex = new RegExp(`(${keyword})`, 'i')
            result.__name__ = result.name
            result.name = result.name.replace(regex, '<b>$1</b>')

            if (!urlRecordMap[result.id]) {
              urlRecordMap[result.id] = true
              navData.push(result)
              return true
            }
          }
          return false
        }

        try {
          switch (sType) {
            case SearchType.Url:
              searchUrl()
              break

            case SearchType.Title:
              searchTitle()
              break

            case SearchType.Desc:
              searchDesc()
              break

            case SearchType.Quick:
              searchQuick()
              break

            default:
              searchTitle()
              searchDesc()
              searchUrl()
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
  }

  if (sType === SearchType.Current) {
    f(navList[page].nav[id].nav)
  } else {
    f()
  }

  if (navData.length <= 0) {
    return []
  }

  return resultList
}
