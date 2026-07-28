// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { signal } from '@angular/core'
import { IWebProps, NavNode } from 'src/types'

/**
 * 全局弹窗状态（替代 mitt 的 CREATE_WEB / SET_CREATE_WEB / MOVE_WEB 事件）。
 *
 * 与 NavStore 一致的模块级单例风格：emit 方 set payload，
 * 弹窗组件用 effect 监听并打开。
 */
export interface ICreateWebPayload {
  detail?: IWebProps | null
  oneIndex?: number
  twoIndex?: number
  threeIndex?: number
  isMove?: boolean
}

export interface IMoveWebPayload {
  indexs: number[]
  data: NavNode[]
  level?: number
}

class DialogService {
  /** 打开"新建/编辑网站"弹窗（payload 为 null 表示仅打开） */
  readonly createWebPayload = signal<ICreateWebPayload | null>(null)

  /** 直接设置 create-web 组件属性（收录确认场景） */
  readonly setCreateWebPayload = signal<Record<string, any> | null>(null)

  /** 打开"移动网站"弹窗 */
  readonly moveWebPayload = signal<IMoveWebPayload | null>(null)

  openCreateWeb(payload?: ICreateWebPayload) {
    this.createWebPayload.set(payload ?? {})
  }

  setCreateWeb(props: Record<string, any>) {
    this.setCreateWebPayload.set(props)
  }

  openMoveWeb(payload: IMoveWebPayload) {
    this.moveWebPayload.set(payload)
  }
}

export const dialogService = new DialogService()
