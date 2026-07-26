// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { signal, computed } from '@angular/core'
import dbJson from '../../data/db.json'
import searchJson from '../../data/search.json'
import settingsJson from '../../data/settings.json'
import tagJson from '../../data/tag.json'
import internalJson from '../../data/internal.json'
import componentJson from '../../data/component.json'
import {
  ISettings,
  ISearchEngineProps,
  ITagPropValues,
  internalProps,
  INavProps,
  IComponentProps,
} from 'src/types'
import navConfig from '../../nav.config.json'

// 与 src/utils/util.ts 的 isSelfDevelop 一致（此处内联以避免 store <-> utils 循环依赖）
const isSelfDevelop = !!navConfig.address

/**
 * NavStore —— 全局状态的单一可信源（响应式）
 *
 * 设计约定：
 * 1. 模块级单例（不走 DI）：保证工具函数/组件/服务访问同一状态，
 *    无双实例风险，无初始化时序问题。
 * 2. 顶层数组/对象的替换通过 signal.set/update 触发响应。
 * 3. 导航树深层节点的修改允许原地进行（避免 800+ 节点深拷贝），
 *    修改完成后必须调用 touchWebsiteList() 通知订阅方。
 * 4. 持久化（localforage / Git API）不在本类内，由调用方组合，
 *    避免 store -> api -> store 循环依赖。
 */
class NavStore {
  readonly settings = signal<ISettings>(settingsJson as ISettings)

  readonly searchEngineList = signal<ISearchEngineProps[]>(
    isSelfDevelop ? [] : searchJson
  )

  readonly tagList = signal<Array<ITagPropValues>>(
    isSelfDevelop ? [] : tagJson
  )

  readonly internal = signal<internalProps>(internalJson)

  readonly websiteList = signal<INavProps[]>(
    isSelfDevelop ? [] : (dbJson as INavProps[])
  )

  readonly components = signal<IComponentProps[]>(
    isSelfDevelop ? [] : componentJson
  )

  /** 标签 id -> 标签配置（派生状态，tagList 变化自动重算） */
  readonly tagMap = computed(() => {
    const map: Record<string, ITagPropValues> = {}
    for (const item of this.tagList()) {
      if (item.id) {
        map[item.id] = { ...item }
      }
    }
    return map
  })

  // ==================== actions ====================

  /** 通知：导航树被原地修改过（浅拷贝顶层数组触发订阅方） */
  touchWebsiteList() {
    this.websiteList.update((list) => [...list])
  }

  /** 通知：settings 的嵌套属性被原地修改过 */
  touchSettings() {
    this.settings.update((s) => ({ ...s }))
  }

  touchTagList() {
    this.tagList.update((list) => [...list])
  }

  touchSearchEngineList() {
    this.searchEngineList.update((list) => [...list])
  }

  touchComponents() {
    this.components.update((list) => [...list])
  }

  setWebsiteList(list: INavProps[]) {
    // 浅拷贝保证即使传入同一引用也触发订阅方（原地修改后的同步场景）
    this.websiteList.set([...list])
  }

  setSettings(settings: ISettings) {
    this.settings.set({ ...settings })
  }

  /** 整体覆盖 settings（服务端拉取场景：逐键覆盖后触发一次） */
  patchSettings(patch: Partial<ISettings>) {
    this.settings.update((s) => ({ ...s, ...patch }))
  }

  setTagList(list: ITagPropValues[]) {
    this.tagList.set(list)
  }

  setSearchEngineList(list: ISearchEngineProps[]) {
    this.searchEngineList.set(list)
  }

  setComponents(list: IComponentProps[]) {
    this.components.set(list)
  }

  setInternal(internal: internalProps) {
    this.internal.set({ ...internal })
  }

  /** 自有部署拉取全量内容（替代 getContentes 中的 splice/push/逐键赋值） */
  replaceAllContents(data: {
    webs: INavProps[]
    tags: ITagPropValues[]
    search: ISearchEngineProps[]
    components: IComponentProps[]
    settings: ISettings
    internal: internalProps
  }) {
    this.setWebsiteList(data.webs)
    this.setTagList(data.tags)
    this.setSearchEngineList(data.search)
    this.setComponents(data.components)
    this.setSettings(data.settings)
    this.setInternal(data.internal)
  }
}

export const navStore = new NavStore()
