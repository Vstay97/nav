// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
// Modified by Vstay97, 2026

import type { IDataProvider } from './data-provider'
import { StaticGitProvider } from './static-git.provider'

/** 数据提供者单例：静态 Git 模式（数据直写仓库 data/*.json） */
export const dataProvider: IDataProvider = new StaticGitProvider()

export type { IDataProvider, IUpdateFileParams } from './data-provider'

// Git 仓库元信息与 CDN 地址（静态模式使用）
export {
  authorName,
  repoName,
  imageRepo,
  imageBranch,
  getCDN,
} from './static-git.provider'
