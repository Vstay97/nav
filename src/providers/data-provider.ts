// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
// Modified by Vstay97, 2026

import { INavProps } from 'src/types'

/**
 * 数据提供者接口 —— 静态 Git 部署模式（数据存于 Git 仓库 data/*.json）。
 *
 * 调用方（组件/服务/utils）只面向该接口编程；
 * 具体实现由 src/providers/index.ts 静态选定。
 */

export interface IUpdateFileParams {
  message?: string
  content: string
  path: string
  branch?: string
  isEncode?: boolean
}

export interface IDataProvider {
  /**
   * 轻量 UI 状态（如分类折叠）是否需要持久化：
   * true → 写 localforage，刷新后保持
   */
  readonly persistUiState: boolean

  /** 启动时加载初始数据并写入 NavStore（含就绪通知） */
  fetchInitialData(): Promise<void>

  /** 持久化网站数据（写 localforage） */
  saveWebsiteList(list: INavProps[]): Promise<any>

  /** 更新数据文件（settings/tag/search/component/db 等） */
  updateFileContent(params: IUpdateFileParams): Promise<any>

  /** 创建文件（图片上传等） */
  createFile(params: IUpdateFileParams): Promise<any>

  /** 验证登录凭证 */
  verifyToken(token: string): Promise<any>

  /** 创建图片分支 */
  createBranch(branch: string): Promise<any>

  /** 抓取目标网站的图标/标题/描述 */
  getWebInfo(url: string): Promise<Record<string, any>>
}
