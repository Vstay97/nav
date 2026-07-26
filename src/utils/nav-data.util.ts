// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { INavThreeProp } from '../types'
import { navStore } from 'src/store/nav.store'
import { isLogin } from './user'
import { queryString } from './query.util'

export function matchCurrentList(): INavThreeProp[] {
  const { id, page } = queryString()
  const websiteList = navStore.websiteList()
  let data: INavThreeProp[] = []

  try {
    if (
      websiteList[page] &&
      websiteList[page]?.nav?.length > 0 &&
      (isLogin || !websiteList[page].nav[id].ownVisible)
    ) {
      data = websiteList[page].nav[id].nav
    } else {
      data = []
    }
  } catch {
    data = []
  }

  return data
}
