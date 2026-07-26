// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import navConfig from '../../nav.config.json'
import type { IDataProvider } from './data-provider'
import { StaticGitProvider } from './static-git.provider'
import { SelfHostProvider } from './self-host.provider'

/**
 * 数据提供者单例：按部署模式（nav.config.yaml 的 address）静态选定。
 * 与 NavStore 同样的模块级单例风格，保证全局唯一。
 */
export const dataProvider: IDataProvider = navConfig.address
  ? new SelfHostProvider()
  : new StaticGitProvider()

export type { IDataProvider, IUpdateFileParams } from './data-provider'
