// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
// Modified by Vstay97, 2026
import localforage from 'localforage'
import { STORAGE_KEY_MAP } from 'src/constants'

export function getToken() {
  return window.localStorage.getItem(STORAGE_KEY_MAP.token) || ''
}

export function setToken(token: string) {
  return window.localStorage.setItem(STORAGE_KEY_MAP.token, token)
}

export function removeToken() {
  return window.localStorage.removeItem(STORAGE_KEY_MAP.token)
}

export function removeWebsite() {
  return localforage.removeItem(STORAGE_KEY_MAP.website)
}

export function userLogout() {
  localforage.clear()
  window.localStorage.clear()
  window.sessionStorage.clear()
}

export const isLogin: boolean = !!getToken()
