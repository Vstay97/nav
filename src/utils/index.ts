// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

/**
 * 工具函数统一出口（barrel）。
 * 各函数已按域拆分到独立文件，此处 re-export 保持既有 import 路径不变：
 *   import { fuzzySearch, queryString } from 'src/utils'
 */

export * from './text.util'
export * from './query.util'
export * from './search.util'
export * from './dom.util'
export * from './theme.util'
export * from './date.util'
export * from './engine.util'
export * from './nav-data.util'
