// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

// value 可能含有标签元素，用于过滤掉标签获取纯文字
export function getTextContent(value: string): string {
  if (!value) return ''
  return value.replace(/<b>|<\/b>/g, '')
}

export function randomInt(max: number) {
  return Math.floor(Math.random() * max)
}
