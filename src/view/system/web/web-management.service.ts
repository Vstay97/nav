// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Injectable } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NzModalService } from 'ng-zorro-antd/modal'
import { saveAs } from 'file-saver'
import { INavProps, IWebProps } from 'src/types'
import { navStore } from 'src/store/nav.store'
import { setWebsiteList, deleteByWeb } from 'src/utils/web'
import { updateFileContent } from 'src/api'
import { getTextContent } from 'src/utils'
import { removeWebsite } from 'src/utils/user'
import { DB_PATH, STORAGE_KEY_MAP } from 'src/constants'
import { $t } from 'src/locale'

export interface ICategoryPayload {
  title: string
  icon: string
  ownVisible: boolean
}

/**
 * 后台"网站管理"的领域服务：
 * 分类（一/二/三级）与网站的增删改、排序移动、批量删除、
 * 错误网站收集、同步/备份/重置。
 *
 * 索引路径约定：[] 一级分类 / [a] 二级 / [a,b] 三级 / [a,b,c] 网站列表
 */
@Injectable({
  providedIn: 'root',
})
export class WebManagementService {
  constructor(
    private message: NzMessageService,
    private notification: NzNotificationService,
    private modal: NzModalService
  ) {}

  private get websiteList(): INavProps[] {
    return navStore.websiteList()
  }

  /** 按索引路径取目标列表：[] → 一级；[a] → 二级；[a,b] → 三级；[a,b,c] → 网站 */
  getListByPath(path: number[]): any[] {
    let node: any = { nav: this.websiteList }
    for (const idx of path) {
      node = node.nav?.[idx]
      if (!node) {
        return []
      }
    }
    return node.nav ?? []
  }

  /** 列表项上移/下移（direction: -1 上移 / 1 下移），越界不变 */
  moveItem(path: number[], index: number, direction: -1 | 1): void {
    try {
      const list = this.getListByPath(path)
      const target = index + direction
      if (target < 0 || target >= list.length) {
        return
      }
      const current = list[index]
      list[index] = list[target]
      list[target] = current
      setWebsiteList(this.websiteList)
    } catch (error: any) {
      this.notification.error($t('_error'), error.message)
    }
  }

  /** 删除指定路径下的分类项 */
  deleteCategoryAt(path: number[], index: number): void {
    this.getListByPath(path).splice(index, 1)
    this.message.success($t('_delSuccess'))
    setWebsiteList(this.websiteList)
  }

  /** 新增/编辑分类（editIdx 为 null 表示新增）；标题重复时提示并返回 false */
  saveCategory(
    path: number[],
    editIdx: number | null,
    payload: ICategoryPayload
  ): boolean {
    const list = this.getListByPath(path)
    const { title, icon, ownVisible } = payload

    const exists = list.some((item) => item.title === title)
    if (editIdx === null) {
      if (exists) {
        this.message.error(`${$t('_repeatAdd')} "${title}"`)
        return false
      }
      list.unshift({
        createdAt: Date.now(),
        title,
        icon,
        ownVisible,
        nav: [],
      })
      this.message.success($t('_addSuccess'))
    } else {
      if (exists && list[editIdx].title !== title) {
        this.message.error(`${$t('_repeatAdd')} "${title}"`)
        return false
      }
      list[editIdx].title = title
      list[editIdx].icon = icon
      list[editIdx].ownVisible = ownVisible
      this.message.success($t('_saveSuccess'))
    }

    setWebsiteList(this.websiteList)
    return true
  }

  /** 按标题集合批量删除分类（path 定位父列表；一级分类整体替换） */
  deleteCategoriesBatch(path: number[], titles: Set<string>): void {
    if (path.length === 0) {
      navStore.setWebsiteList(
        this.websiteList.filter((item) => !titles.has(item.title))
      )
      setWebsiteList()
      return
    }
    const parent = this.nodeByPath(path)
    if (!parent) {
      return
    }
    parent.nav = parent.nav.filter(
      (item: any) => !titles.has(item.title as string)
    )
    setWebsiteList(this.websiteList)
  }

  /** 批量删除网站条目 */
  deleteWebs(items: IWebProps[]): void {
    items.forEach((item) => {
      deleteByWeb({
        ...item,
        name: getTextContent(item.name),
        desc: getTextContent(item.desc),
      })
    })
    this.message.success($t('_delSuccess'))
  }

  /** 删除单个网站条目；返回是否删除成功 */
  deleteWeb(item: IWebProps): boolean {
    const ok = deleteByWeb(item)
    if (ok) {
      this.message.success($t('_delSuccess'))
    }
    return ok
  }

  /** 收集全树中 ok === false 的疑似异常网站 */
  collectErrorWebs(): IWebProps[] {
    const errorWebs: IWebProps[] = []
    function r(nav: any) {
      if (!Array.isArray(nav)) return
      for (let i = 0; i < nav.length; i++) {
        const item = nav[i]
        if (item.url && item.ok === false) {
          errorWebs.push(item)
        } else {
          r(item.nav)
        }
      }
    }
    r(this.websiteList)
    return errorWebs
  }

  /** 弹确认框后同步网站数据到远端（loading 状态由回调管理；失败给出与同步动作关联的提示与重试指引） */
  confirmAndSync(onLoading: (loading: boolean) => void): void {
    this.modal.info({
      nzTitle: $t('_syncDataOut'),
      nzOkText: $t('_confirmSync'),
      nzContent: $t('_confirmSyncTip'),
      nzOnOk: () => {
        onLoading(true)
        // 返回 Promise：ng-zorro 等待确认动作完成，同时避免未处理的 promise 拒绝
        return this.syncToRemote()
          .then(() => {
            this.message.success($t('_syncSuccessTip'))
          })
          .catch((error: any) => {
            const detail = error?.message ? ` (${error.message})` : ''
            this.notification.error(
              $t('_syncData'),
              `${$t('_syncFailTip')}${detail}`
            )
          })
          .finally(() => {
            onLoading(false)
          })
      },
    })
  }

  /** 弹确认框后清空本地缓存并刷新（恢复初始数据） */
  confirmAndReset(): void {
    this.modal.info({
      nzTitle: $t('_resetInitData'),
      nzContent: $t('_warnReset'),
      nzOnOk: () => this.resetLocalData(),
    })
  }

  /** 同步网站数据到远端 */
  syncToRemote(): Promise<any> {
    return updateFileContent({
      message: 'update db',
      content: JSON.stringify(this.websiteList),
      path: DB_PATH,
    })
  }

  /** 下载全量数据备份（db/settings/tag/search/component 五个 JSON 文件） */
  downloadBackup(): void {
    const params: Record<string, any> = {
      db: this.websiteList,
      settings: navStore.settings(),
      tag: navStore.tagList(),
      search: navStore.searchEngineList(),
      component: navStore.components(),
    }
    for (const k in params) {
      saveAs(
        new Blob([JSON.stringify(params[k])], {
          type: 'text/plain;charset=utf-8',
        }),
        `${k}.json`
      )
    }
  }

  /** 从备份文件恢复网站数据（成功后刷新页面） */
  uploadBackupFile(file: File): void {
    const fileReader = new FileReader()
    fileReader.readAsText(file)
    fileReader.onload = (data) => {
      try {
        const { result } = data.target as any
        navStore.setWebsiteList(JSON.parse(result))
        this.message.success($t('_actionSuccess'))
        setWebsiteList().finally(() => {
          location.reload()
        })
      } catch (error: any) {
        this.notification.error($t('_error'), error.message)
      }
    }
  }

  /** 清空本地缓存并刷新（恢复初始数据） */
  resetLocalData(): void {
    this.message.success($t('_actionSuccess'))
    window.localStorage.removeItem(STORAGE_KEY_MAP.s_url)
    removeWebsite().finally(() => {
      window.location.reload()
    })
  }

  private nodeByPath(path: number[]): any {
    let node: any = { nav: this.websiteList }
    for (const idx of path) {
      node = node.nav?.[idx]
      if (!node) {
        return null
      }
    }
    return node
  }
}
