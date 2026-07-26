// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input } from '@angular/core'
import { navStore } from 'src/store/nav.store'
import { ComponentType, IComponentProps } from 'src/types'
import { NgIf, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { CalendarComponent } from '../calendar/index.component';
import { RuntimeComponent } from '../runtime/index.component';
import { OffWorkComponent } from '../off-work/index.component';
import { ImageComponent } from '../image/index.component';
import { CountdownComponent } from '../countdown/index.component';
import { HTMLComponent } from '../html/index.component';
import { HolidayComponent } from '../holiday/index.component';

@Component({
    selector: 'component-group',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        NgSwitch,
        NgSwitchCase,
        CalendarComponent,
        RuntimeComponent,
        OffWorkComponent,
        ImageComponent,
        CountdownComponent,
        HTMLComponent,
        HolidayComponent,
    ],
})
export class ComponentGroupComponent {
  @Input() direction: string = ''

  ComponentType = ComponentType
  components: IComponentProps[] = []

  constructor() {
    const c: IComponentProps[] = []
    const components = navStore.components()
    const settingsComponents = navStore.settings().components
    // 按照系统设置顺序排序显示
    components.forEach((item) => {
      const has = settingsComponents.find(
        (c) => c.type === item.type && c.id === item.id
      )
      if (has) {
        c.push({
          ...item,
          ...has,
        })
      }
    })
    this.components = c
  }

  trackByItem(i: number, item: any) {
    return item.id
  }
}
