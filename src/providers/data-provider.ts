// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { INavProps } from 'src/types'

/**
 * 数据提供者接口 —— 屏蔽"静态 Git 部署"与"自有部署"两种模式的差异。
 *
 * 调用方（组件/服务/utils）只面向该接口编程，不再出现 isSelfDevelop 分支；
 * 具体实现由 src/providers/index.ts 按 navConfig.address 静态选定。
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
   * 静态模式 → true（写 localforage，刷新后保持）
   * 自有部署 → false（避免频繁写服务端 db.json，刷新后重置）
   */
  readonly persistUiState: boolean

  /** 启动时加载初始数据并写入 NavStore（含就绪通知） */
  fetchInitialData(): Promise<void>

  /** 持久化网站数据（静态模式 → localforage；自有部署 → 服务端） */
  saveWebsiteList(list: INavProps[]): Promise<any>

  /** 更新数据文件（settings/tag/search/component/db 等） */
  updateFileContent(params: IUpdateFileParams): Promise<any>

  /** 创建文件（图片上传等） */
  createFile(params: IUpdateFileParams): Promise<any>

  /** 验证登录凭证 */
  verifyToken(token: string): Promise<any>

  /** 创建图片分支（静态 Git 模式专用，自有部署为 no-op） */
  createBranch(branch: string): Promise<any>

  /** 自有部署爬虫刷新（静态模式不可用，resolve 空值） */
  spiderWeb(data?: any): Promise<any>

  /** 用户收录 */
  getUserCollect(data?: Record<string, any>): Promise<any>
  saveUserCollect(data?: Record<string, any>): Promise<any>
  delUserCollect(data?: Record<string, any>): Promise<any>

  /** 抓取目标网站的图标/标题/描述 */
  getWebInfo(url: string): Promise<Record<string, any>>
}
