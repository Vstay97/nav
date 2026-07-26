// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import qs from 'qs'
import { STORAGE_KEY_MAP } from 'src/constants'
import { navStore } from 'src/store/nav.store'

export function queryString(): qs.ParsedQs & {
  q: string
  id: number
  page: number
} {
  const { href } = window.location
  const search = href.split('?')[1] || ''
  const parseQs = qs.parse(search)
  let id = parseInt(parseQs['id'] as string) || 0
  let page = parseInt(parseQs['page'] as string) || 0

  if (parseQs['id'] === undefined && parseQs['page'] === undefined) {
    try {
      const location = window.localStorage.getItem(STORAGE_KEY_MAP.location)
      if (location) {
        const localLocation = JSON.parse(location)
        page = localLocation.page || 0
        id = localLocation.id || 0
      }
    } catch {}
  }

  if (page > navStore.websiteList().length - 1) {
    page = 0
    id = 0
  } else {
    const websiteList = navStore.websiteList()
    if (websiteList[page] && !(id <= websiteList[page].nav.length - 1)) {
      id = websiteList[page].nav.length - 1
    }
  }

  page = page < 0 ? 0 : page
  id = id < 0 ? 0 : id

  return {
    ...parseQs,
    q: (parseQs['q'] || '') as string,
    id,
    page,
  } as qs.ParsedQs & { q: string; id: number; page: number }
}

export function setLocation() {
  const { page, id } = queryString()

  window.localStorage.setItem(
    STORAGE_KEY_MAP.location,
    JSON.stringify({
      page,
      id,
    })
  )
}
