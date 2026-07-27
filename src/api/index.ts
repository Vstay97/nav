// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// Modified by Vstay97, 2026

import config from '../../nav.config.json'
import { httpNav } from '../utils/http'
import { navStore } from 'src/store/nav.store'
import { dataProvider } from 'src/providers'
import type { IUpdateFileParams } from 'src/providers'
import {
  authorName,
  repoName,
  imageRepo,
  imageBranch,
  isGitee,
} from 'src/providers/static-git.provider'

// Git 仓库元信息（静态模式使用；自有部署下为空值语义不变）
export { authorName, repoName, imageRepo, imageBranch }

type Iupdate = IUpdateFileParams

// 验证Token
export function verifyToken(token: string) {
  return dataProvider.verifyToken(token)
}

// 自有部署爬取信息
export function spiderWeb(data?: any) {
  return dataProvider.spiderWeb(data)
}

// 创建分支
export function createBranch(branch: string) {
  return dataProvider.createBranch(branch)
}

// 更新文件内容
export function updateFileContent(params: Iupdate) {
  return dataProvider.updateFileContent(params)
}

// 创建文件（图片上传）
export function createFile(params: Iupdate) {
  return dataProvider.createFile(params)
}

export async function getWebInfo(url: string) {
  return dataProvider.getWebInfo(url)
}

export async function bookmarksExport(data: any) {
  return httpNav.post('/api/export', data, {
    timeout: 0,
  })
}

export async function getIconBase64(data: any) {
  return httpNav.post('/api/base64', data, { timeout: 20000 })
}

export async function getUserInfo(data?: Record<string, any>) {
  return httpNav.post('/api/info/get', data)
}

export async function updateUserInfo(data?: Record<string, any>) {
  return httpNav.post('/api/info/update', data)
}

export function getCDN(path: string) {
  const branch = imageBranch || 'image'
  const repo = imageRepo || repoName
  if (isGitee()) {
    return `https://gitee.com/${authorName}/${repo}/raw/${branch}/${path}`
  }
  return `https://${navStore.settings().gitHubCDN}/gh/${authorName}/${repo}@${branch}/${path}`
}
