// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.

import { Component } from '@angular/core'
import { getDateTime, isMobile } from 'src/utils'
import { navStore } from 'src/store/nav.store'
import { IWebProps, ISettings } from 'src/types'
import { JumpService } from 'src/services/jump'
import { $t } from 'src/locale'
import { NgStyle, NgIf, NgFor } from '@angular/common';
import { SearchEngineComponent } from '../../components/search-engine/search-engine.component';
import { WebListComponent } from '../../components/web-list/index.component';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { LogoComponent } from '../../components/logo/logo.component';
import { FixbarComponent } from '../../components/fixbar/index.component';

@Component({
    selector: 'app-shortcut',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [
        NgStyle,
        SearchEngineComponent,
        WebListComponent,
        NgIf,
        NgFor,
        NzTooltipDirective,
        LogoComponent,
        FixbarComponent,
    ],
})
export class ShortcutComponent {
  $t = $t
  isMobile = isMobile()
  shortcutThemeImage =
    navStore.settings().shortcutThemeImages?.[0]?.['src']
  timer: any = null
  month = 0
  date = 0
  hours = ''
  minutes = ''
  seconds = ''
  dayText = ''
  iconSize: number = 0
  frameLoad = false

  get settings(): ISettings {
    return navStore.settings()
  }

  get isDark(): boolean {
    return navStore.isDark()
  }

  get dockList(): IWebProps[] {
    return navStore.dockList()
  }

  constructor(public jumpService: JumpService) {
    this.getDateTime()
  }

  ngOnInit() {
    document.addEventListener('visibilitychange', (e: any) => {
      const hide = e.target.hidden
      if (hide) {
        clearTimeout(this.timer)
      } else {
        this.getDateTime()
      }
    })
  }

  handleMouseLeave(e: any) {
    try {
      const imgs = e.currentTarget.querySelectorAll('.common-icon')
      if (this.iconSize !== 0) {
        imgs.forEach((el: HTMLImageElement) => {
          el.style.width = `${this.iconSize}px`
          el.style.height = `${this.iconSize}px`
        })
      }
    } catch (error) {}
  }

  handleMouseOver(e: any) {
    if (this.isMobile) {
      return
    }

    try {
      const imgs = e.currentTarget.querySelectorAll('.common-icon')
      if (!imgs.length) {
        return
      }

      const nodeName = e.target.nodeName
      if (nodeName === 'APP-LOGO' || nodeName === 'div') {
        if (this.iconSize === 0) {
          this.iconSize = imgs[0].clientWidth
        }
        const index = Number(e.target.dataset.index)
        imgs.forEach((el: HTMLImageElement) => {
          el.style.width = `${this.iconSize}px`
          el.style.height = `${this.iconSize}px`
        })
        const largeSize = this.iconSize * 1.4
        imgs[index].style.width = `${largeSize}px`
        imgs[index].style.height = `${largeSize}px`
        const middleSize = this.iconSize * 1.2
        const smallSize = this.iconSize * 1.04
        if (imgs[index - 1]) {
          imgs[index - 1].style.width = `${middleSize}px`
          imgs[index - 1].style.height = `${middleSize}px`
        }
        if (imgs[index - 2]) {
          imgs[index - 2].style.width = `${smallSize}px`
          imgs[index - 2].style.height = `${smallSize}px`
        }
        if (imgs[index + 1]) {
          imgs[index + 1].style.width = `${middleSize}px`
          imgs[index + 1].style.height = `${middleSize}px`
        }
        if (imgs[index + 2]) {
          imgs[index + 2].style.width = `${smallSize}px`
          imgs[index + 2].style.height = `${smallSize}px`
        }
      }
    } catch (error) {}
  }

  getDateTime() {
    this.timer = setTimeout(() => {
      this.getDateTime()
    }, 1000)
    const { hours, minutes, seconds, month, date, dayText } = getDateTime()
    this.hours = hours
    this.minutes = minutes
    this.seconds = seconds
    this.month = month
    this.date = date
    this.dayText = dayText
  }

  ngOnDestroy() {
    clearTimeout(this.timer)
  }

  trackByItemWeb(a: any, item: any) {
    return item.id
  }

  iframeLoad() {
    this.frameLoad = true
  }
}
