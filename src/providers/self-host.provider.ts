// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import http from 'src/utils/http'
import event from 'src/utils/mitt'
import { navStore } from 'src/store/nav.store'
import { isLogin } from 'src/utils/user'
import { DB_PATH } from 'src/constants'
import { ISettings, INavProps } from 'src/types'
import { requestActionUrl } from './utils'
import type { IDataProvider, IUpdateFileParams } from './data-provider'

/**
 * 自有部署（isSelfDevelop）数据提供者：
 * 数据由自带 Express 服务（server.mjs）读写本地 data/*.json，
 * 前端通过 /api/* 接口交互。
 */
export class SelfHostProvider implements IDataProvider {
  readonly persistUiState = false

  /** 拉取全量内容并写入 NavStore */
  private getContentes(): Promise<any> {
    return http.post('/api/contents/get').then((res: any) => {
      navStore.replaceAllContents({
        webs: res.data.webs,
        tags: res.data.tags,
        search: res.data.search,
        components: res.data.components,
        settings: res.data.settings as ISettings,
        internal: res.data.internal,
      })
      return res
    })
  }

  async fetchInitialData(): Promise<void> {
    await this.getContentes()
    event.emit('WEB_FINISH')
    window.__FINISHED__ = true
  }

  saveWebsiteList(list: INavProps[]): Promise<any> {
    return this.updateFileContent({
      content: JSON.stringify(list),
      path: DB_PATH,
    })
  }

  updateFileContent(params: IUpdateFileParams): Promise<any> {
    if (!isLogin) {
      return Promise.resolve()
    }
    return http
      .post('/api/contents/update', {
        path: params.path,
        content: params.content,
      })
      .then((res) => {
        this.getContentes()
        requestActionUrl()
        return res
      })
  }

  createFile(params: IUpdateFileParams): Promise<any> {
    return http
      .post('/api/contents/create', {
        path: params.path,
        content: params.content,
      })
      .then((res) => {
        requestActionUrl()
        return res
      })
  }

  verifyToken(token: string): Promise<any> {
    return http.get('/api/users/verify', {
      headers: {
        Authorization: `token ${token.trim()}`,
      },
    })
  }

  /** 自有部署无需 Git 分支 */
  createBranch(_branch: string): Promise<any> {
    return Promise.resolve()
  }

  spiderWeb(data?: any): Promise<any> {
    return http
      .post('/api/spider', data, {
        timeout: 0,
      })
      .then((res) => {
        this.getContentes()
        return res
      })
  }

  getUserCollect(data?: Record<string, any>): Promise<any> {
    return http.post('/api/collect/get', data)
  }

  saveUserCollect(data?: Record<string, any>): Promise<any> {
    return http.post('/api/collect/save', data)
  }

  delUserCollect(data?: Record<string, any>): Promise<any> {
    return http.post('/api/collect/delete', data)
  }

  async getWebInfo(url: string): Promise<Record<string, any>> {
    try {
      const res = await http.post('/api/web/info', { url })
      return {
        ...res.data,
      }
    } catch {
      return {}
    }
  }
}
