// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { $t } from 'src/locale'

export function addZero(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

// 今年第几天
export function getDayOfYear() {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 0)
  // @ts-ignore
  const diff = now - startOfYear
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

export function getDateTime() {
  const weeks = $t('_weeks')
  const now = new Date()
  const year = now.getFullYear()
  const hours = addZero(now.getHours())
  const minutes = addZero(now.getMinutes())
  const seconds = addZero(now.getSeconds())
  const month = now.getMonth() + 1
  const date = now.getDate()
  const day = now.getDay()
  const zeroDate = addZero(date)
  return {
    year,
    hours,
    minutes,
    seconds,
    month,
    date,
    zeroDate,
    dayText: weeks[day],
  } as const
}
