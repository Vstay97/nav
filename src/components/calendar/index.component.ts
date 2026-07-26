// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input } from '@angular/core'
import { getDateTime, getDayOfYear } from 'src/utils'
import { ICalendarComponent } from 'src/types'

@Component({
    selector: 'app-calendar',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
})
export class CalendarComponent {
  @Input() data!: ICalendarComponent

  date = ''
  day = ''
  week = ''
  dayOfYear = 0

  constructor() {
    const date = getDateTime()
    this.date = `${date.year}年${date.month}月`
    this.day = date.zeroDate
    this.week = date.dayText
    this.dayOfYear = getDayOfYear()
  }
}
