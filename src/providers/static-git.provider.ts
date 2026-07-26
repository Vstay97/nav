// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import localforage from 'localforage'
import qs from 'qs'
import LZString from 'lz-string'
import { encode } from 'js-base64'
import navConfig from '../../nav.config.json'
import http, { httpNav } from 'src/utils/http'
import { navStore } from 'src/store/nav.store'
import { notify } from 'src/services/notify'
import { isLogin } from 'src/utils/user'
import { $t } from 'src/locale'
import { DB_PATH, STORAGE_KEY_MAP } from 'src/constants'
import { INavProps, IWebProps } from 'src/types'
import { requestActionUrl } from './utils'
import type { IDataProvider, IUpdateFileParams } from './data-provider'

const { gitRepoUrl, imageRepoUrl } = navConfig
const DEFAULT_BRANCH = navConfig.branch

const s = gitRepoUrl.split('/')
export const authorName = s.at(-2)
export const repoName = s.at(-1)

export let imageRepo = ''
export let imageBranch = ''

if (imageRepoUrl) {
  const split = imageRepoUrl.split('?')
  imageRepo = split[0].split('/').at(-1) || ''
  const query = qs.parse(split.at(-1) || '')
  if (query['branch']) {
    imageBranch = query['branch'] as string
  }
}

export function isGitee() {
  return navConfig.gitRepoUrl.includes('gitee.com')
}

/** 按登录态过滤 ownVisible 节点（原地修改深层 nav，返回过滤后的顶层数组） */
export function adapterWebsiteList(websiteList: any[]) {
  function filterOwn(item: IWebProps) {
    if (item.ownVisible && !isLogin) {
      return false
    }
    return true
  }
  websiteList = websiteList.filter(filterOwn)
  for (let i = 0; i < websiteList.length; i++) {
    const item = websiteList[i]

    if (Array.isArray(item.nav)) {
      item.nav = item.nav.filter(filterOwn)
      adapterWebsiteList(item.nav)
    }
  }

  return websiteList
}

function getFileContent(path: string, branch: string = DEFAULT_BRANCH) {
  return http.get(`/repos/${authorName}/${repoName}/contents/${path}`, {
    params: {
      ref: branch,
    },
  })
}

function getCommits() {
  return http.get(`/repos/${authorName}/${repoName}/commits`)
}

/**
 * 静态 Git 部署（Fork / GitHub Pages）数据提供者：
 * 数据存于 Git 仓库（db.json 等），本地经 localforage 缓存，
 * 收录/图标等走 api.nav3.cn。
 */
export class StaticGitProvider implements IDataProvider {
  readonly persistUiState = true

  async fetchInitialData(): Promise<void> {
    const finish = (dbData: any[]) => {
      navStore.setWebsiteList(dbData)
      navStore.markReady()
    }
    const data = adapterWebsiteList(navStore.websiteList())
    if (!isLogin) {
      finish(data)
      return
    }
    const storageDate = window.localStorage.getItem(STORAGE_KEY_MAP.s_url)

    // 检测到网站更新，清除缓存本地保存记录失效
    if (storageDate !== navConfig.datetime) {
      const whiteList = [
        STORAGE_KEY_MAP.token,
        STORAGE_KEY_MAP.isDark,
        STORAGE_KEY_MAP.authCode,
      ]
      const len = window.localStorage.length
      for (let i = 0; i < len; i++) {
        const key = window.localStorage.key(i) as string
        if (whiteList.includes(key)) {
          continue
        }
        window.localStorage.removeItem(key)
      }
      window.localStorage.setItem(STORAGE_KEY_MAP.s_url, navConfig.datetime)
      localforage.removeItem(STORAGE_KEY_MAP.website)
      finish(data)
      setTimeout(() => {
        notify({
          type: 'success',
          title: $t('_buildSuccess'),
          content: navConfig.datetime,
          config: {
            nzDuration: 0,
          },
        })
      }, 1000)
      return
    }

    try {
      const dbData: any =
        (await localforage.getItem(STORAGE_KEY_MAP.website)) || data
      finish(dbData)
    } catch {
      finish(data)
    }
  }

  saveWebsiteList(list: INavProps[]): Promise<any> {
    return localforage.setItem(STORAGE_KEY_MAP.website, list)
  }

  async updateFileContent({
    message = 'update',
    content,
    path,
    branch = DEFAULT_BRANCH,
    isEncode = true,
  }: IUpdateFileParams): Promise<any> {
    const fileInfo = await getFileContent(path, branch)
    if (path === DB_PATH) {
      content = LZString.compressToBase64(content)
    }

    return http
      .put(`/repos/${authorName}/${repoName}/contents/${path}`, {
        message: `rebot(CI): ${message}`,
        branch,
        content: isEncode ? encode(content) : content,
        sha: fileInfo.data.sha,
      })
      .then((res) => {
        requestActionUrl()
        return res
      })
  }

  async createFile({
    message,
    content,
    path,
    branch = DEFAULT_BRANCH,
    isEncode = true,
  }: IUpdateFileParams): Promise<any> {
    const method = isGitee() ? http.post : http.put
    return method(
      `/repos/${authorName}/${imageRepo || repoName}/contents/${path}`,
      {
        message: `rebot(CI): ${message}`,
        branch,
        content: isEncode ? encode(content) : content,
      }
    ).then((res) => {
      requestActionUrl()
      return res
    })
  }

  verifyToken(token: string): Promise<any> {
    return http.get(`/users/${authorName}`, {
      headers: {
        Authorization: `token ${token.trim()}`,
      },
    })
  }

  async createBranch(branch: string): Promise<any> {
    if (imageRepoUrl) {
      return
    }

    const url = isGitee()
      ? `/repos/${authorName}/${repoName}/branches`
      : `/repos/${authorName}/${repoName}/git/refs`
    const params: Record<string, any> = {}
    if (isGitee()) {
      params['owner'] = `/${authorName}`
      params['repo'] = `/${authorName}/${repoName}`
      params['refs'] = DEFAULT_BRANCH
      params['branch_name'] = branch
    } else {
      params['sha'] = 'c1fdab3d29df4740bb97a4ae7f24ed0eaa682557'
      try {
        const commitRes = await getCommits()
        if (commitRes.data?.length > 0) {
          params['sha'] = commitRes.data[0]['sha']
        }
      } catch (error) {}

      params['ref'] = `refs/heads/${branch}`
    }
    return http.post(url, params)
  }

  /** 静态模式无爬虫服务（保留原行为：直接走 /api/spider 会 404，此处显式 no-op） */
  spiderWeb(data?: any): Promise<any> {
    return http
      .post('/api/spider', data, {
        timeout: 0,
      })
      .then((res) => res)
  }

  getUserCollect(data?: Record<string, any>): Promise<any> {
    return httpNav.post('/api/get', data)
  }

  saveUserCollect(data?: Record<string, any>): Promise<any> {
    return httpNav.post('/api/save', data)
  }

  delUserCollect(data?: Record<string, any>): Promise<any> {
    return httpNav.post('/api/delete', data)
  }

  async getWebInfo(url: string): Promise<Record<string, any>> {
    try {
      const res = await httpNav.post('/api/icon', { url })
      return {
        ...res.data,
      }
    } catch {
      return {}
    }
  }
}
