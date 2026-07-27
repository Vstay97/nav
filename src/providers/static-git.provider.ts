// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
// Modified by Vstay97, 2026

import localforage from 'localforage'
import qs from 'qs'
import LZString from 'lz-string'
import { encode } from 'js-base64'
import navConfig from '../../nav.config.json'
import http from 'src/utils/http'
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

/** 解析 imageRepoUrl（形如 `user/repo?branch=image`），模块加载时计算一次后不可变 */
function parseImageRepo(): { imageRepo: string; imageBranch: string } {
  if (!imageRepoUrl) {
    return { imageRepo: '', imageBranch: '' }
  }
  const split = imageRepoUrl.split('?')
  const query = qs.parse(split.at(-1) || '')
  return {
    imageRepo: split[0].split('/').at(-1) || '',
    imageBranch: (query['branch'] as string) || '',
  }
}

export const { imageRepo, imageBranch } = parseImageRepo()

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
 * 静态 Git 部署（Fork / Pages）数据提供者：
 * 数据存于 Git 仓库（db.json 等），本地经 localforage 缓存，
 * 图标抓取经 Cloudflare Worker（见 worker/ 目录）。
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

  /** 抓取目标网站的图标/标题/描述（经 Cloudflare Worker 代理；未配置 workerUrl 时静默返回空） */
  async getWebInfo(url: string): Promise<Record<string, any>> {
    if (!navConfig.workerUrl) {
      return {}
    }
    try {
      const res = await fetch(
        `${navConfig.workerUrl}/webinfo?url=${encodeURIComponent(url)}`
      )
      if (!res.ok) {
        return {}
      }
      return await res.json()
    } catch {
      return {}
    }
  }
}
