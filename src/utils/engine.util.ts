// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { ISearchEngineProps } from '../types'
import { STORAGE_KEY_MAP } from 'src/constants'
import { navStore } from 'src/store/nav.store'

export function getDefaultSearchEngine(): ISearchEngineProps {
  const searchEngineList = navStore.searchEngineList()
  let DEFAULT = (searchEngineList[0] || {}) as ISearchEngineProps
  try {
    const engine = window.localStorage.getItem(STORAGE_KEY_MAP.engine)
    if (engine) {
      const local = JSON.parse(engine)
      const findItem = searchEngineList.find((item) => item.name === local.name)
      if (findItem) {
        DEFAULT = findItem
      }
    }
  } catch {}
  return DEFAULT
}

export function setDefaultSearchEngine(engine: ISearchEngineProps) {
  window.localStorage.setItem(STORAGE_KEY_MAP.engine, JSON.stringify(engine))
}
