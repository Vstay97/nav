// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input, effect } from '@angular/core'
import { navStore } from 'src/store/nav.store'
import { IWebProps, INavProps, TopType } from 'src/types'
import { queryString, fuzzySearch, isMobile, getDefaultTheme } from 'src/utils'
import { isLogin } from 'src/utils/user'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonService } from 'src/services/common'
import { JumpService } from 'src/services/jump'
import { NgIf, NgFor } from '@angular/common';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { LogoComponent } from '../logo/logo.component';

let DEFAULT_WEBSITE: Array<IWebProps> = []

@Component({
    selector: 'app-web-list',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        ɵNzTransitionPatchDirective,
        NzTooltipDirective,
        LogoComponent,
    ],
})
export class WebListComponent {
  @Input() type: 'dock' | '' = ''
  @Input() dockCount = 4
  @Input() size: 'large' | '' = ''
  @Input() max: number = 110
  @Input() search = true
  @Input() overflow = false

  dataList: IWebProps[] = []

  get websiteList(): INavProps[] {
    return navStore.websiteList()
  }

  constructor(
    private router: Router,
    public jumpService: JumpService,
    private activatedRoute: ActivatedRoute,
    public commonService: CommonService
  ) {
    let inited = false
    effect(() => {
      if (!navStore.ready() || inited) {
        return
      }
      inited = true
      this.getTopWeb()
      this.activatedRoute.queryParams.subscribe(() => {
        const { q } = queryString()

        if (this.search && q.trim()) {
          const result = fuzzySearch(this.websiteList, q)
          if (result.length === 0) {
            this.dataList = []
          } else {
            this.dataList = result[0].nav.slice(0, this.max)
          }
        } else {
          this.dataList = DEFAULT_WEBSITE
        }
      })
    })
  }

  ngOnInit() {}

  // 获取置顶WEB
  getTopWeb() {
    let path = this.router.url.split('?')[0].replace('/', '')
    if (!path) {
      path = getDefaultTheme()
    }
    path = path[0].toUpperCase() + path.slice(1)
    const dataList: IWebProps[] = []
    const max = this.max
    let dockList: IWebProps[] = []

    function r(nav: any) {
      if (!Array.isArray(nav)) return

      for (let i = 0; i < nav.length; i++) {
        if (dataList.length > max) {
          break
        }

        const item = nav[i]
        if (item.url) {
          if (item.top && (isLogin || !item.ownVisible)) {
            const isMatch = (item.topTypes || []).some(
              (v: number) => path === TopType[v]
            )
            if (isMatch) {
              dataList.push(item)
            }
          }
        } else {
          r(item.nav)
        }
      }
    }
    r(this.websiteList)

    // @ts-ignore
    this.dataList = dataList.sort((a: any, b: any) => {
      const aIdx = a.index == null || a.index === '' ? 100000 : Number(a.index)
      const bIdx = b.index == null || b.index === '' ? 100000 : Number(b.index)
      return aIdx - bIdx
    })
    if (this.type === 'dock') {
      const dockCount = isMobile() ? 5 : this.dockCount
      dockList = this.dataList.slice(0, dockCount)
      navStore.setDockList(dockList)
      this.dataList = this.dataList.slice(dockCount)
    }
    DEFAULT_WEBSITE = this.dataList
  }
}
