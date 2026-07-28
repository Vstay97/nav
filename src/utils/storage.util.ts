// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { STORAGE_KEY_MAP } from 'src/constants'

/**
 * localStorage 统一访问层（零业务依赖，仅依赖 constants）。
 * 用户态偏好的读写都应经过此处，避免键名硬编码与逻辑散落。
 */

export function storageGet(key: string): string | null {
  return window.localStorage.getItem(key)
}

export function storageSet(key: string, value: string): void {
  window.localStorage.setItem(key, value)
}

export function storageRemove(key: string): void {
  window.localStorage.removeItem(key)
}

/**
 * 暗黑模式初始值的唯一权威实现：
 * 优先取 localStorage 的显式设置；未设置时跟随系统 prefers-color-scheme。
 * nav.store 与 theme.util 均从此处导入，消除重复实现与循环依赖。
 */
export function readIsDark(): boolean {
  const storageVal = storageGet(STORAGE_KEY_MAP.isDark)
  const darkMode = window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches
  if (!storageVal && darkMode) {
    return darkMode
  }
  return Boolean(Number(storageVal))
}
