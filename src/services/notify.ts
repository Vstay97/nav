// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.

import type { NzMessageService } from 'ng-zorro-antd/message'
import type { NzNotificationService } from 'ng-zorro-antd/notification'

/**
 * 全局通知桥（替代 mitt 的 MESSAGE / NOTIFICATION 事件）。
 *
 * NzMessageService / NzNotificationService 是 DI 服务，工具函数/HTTP 拦截器等
 * 非 DI 环境无法直接注入，故在 AppComponent 构造时注册实例，
 * 之后任何模块都可以通过 notify() / notifyMessage() 触发全局提示。
 */

export interface INotifyProps {
  type: 'success' | 'info' | 'warning' | 'error' | 'blank'
  title: string
  content: string
  config?: Record<string, any>
}

export interface IMessageProps {
  type: 'success' | 'info' | 'warning' | 'error' | 'loading'
  content: string
}

let notificationRef: NzNotificationService | null = null
let messageRef: NzMessageService | null = null

export function registerNotifyServices(
  notification: NzNotificationService,
  message: NzMessageService
) {
  notificationRef = notification
  messageRef = message
}

export function notify(props: INotifyProps) {
  notificationRef?.create(props.type, props.title, props.content, props.config)
}

export function notifyMessage(props: IMessageProps) {
  messageRef?.[props.type]?.(props.content)
}
