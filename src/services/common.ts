// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Injectable, effect } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { navStore } from 'src/store/nav.store'
import {
  queryString,
  fuzzySearch,
  matchCurrentList,
  getOverIndex,
} from 'src/utils'
import { setWebsiteList, toggleCollapseAll } from 'src/utils/web'
import { dataProvider } from 'src/providers'
import { INavProps, INavThreeProp, ISettings } from 'src/types'
import { isLogin } from 'src/utils/user'

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  isLogin = isLogin
  currentList: INavThreeProp[] = []
  id = 0
  page = 0
  sliceMax = 0
  selectedIndex = 0 // 第三级菜单选中
  searchKeyword = ''
  overIndex = Number.MAX_SAFE_INTEGER

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    let inited = false
    effect(() => {
      if (!navStore.ready() || inited) {
        return
      }
      inited = true
      this.activatedRoute.queryParams.subscribe(() => {
        const { id, page, q } = queryString()
        this.page = page
        this.id = id
        this.searchKeyword = q
        this.handleCheckThree(0)
        this.sliceMax = 0

        if (q) {
          this.currentList = fuzzySearch(this.websiteList, q)
        } else {
          this.currentList = matchCurrentList()
        }
        setTimeout(() => {
          this.sliceMax = Number.MAX_SAFE_INTEGER
        }, 100)
      })
    })
  }

  get settings(): ISettings {
    return navStore.settings()
  }

  get websiteList(): INavProps[] {
    return navStore.websiteList()
  }

  get title(): string {
    return this.settings.title.trim().split(/\s/)[0]
  }

  handleCilckTopNav(index: number) {
    const id = this.websiteList[index].id || 0
    this.router.navigate([this.router.url.split('?')[0]], {
      queryParams: {
        page: index,
        id,
        _: Date.now(),
      },
    })
  }
  handleSidebarNav(index: number, pageIndex?: number) {
    const { page } = queryString()
    this.websiteList[pageIndex ?? page].id = index
    this.router.navigate([this.router.url.split('?')[0]], {
      queryParams: {
        page: pageIndex ?? page,
        id: index,
        _: Date.now(),
      },
    })
  }

  handleCheckThree(index: number) {
    this.selectedIndex = index
  }

  onCollapseAll = (e?: Event) => {
    e?.stopPropagation()
    toggleCollapseAll(this.websiteList)
  }

  trackByItem(a: any, item: any) {
    return item.title
  }

  trackByItemWeb(a: any, item: any) {
    return item.id
  }

  get collapsed() {
    try {
      return !!this.websiteList[this.page].nav[this.id].collapsed
    } catch (error) {
      return false
    }
  }

  onCollapse = (item: any, index: number) => {
    item.collapsed = !item.collapsed
    this.websiteList[this.page].nav[this.id].nav[index] = item
    navStore.touchWebsiteList()
    if (dataProvider.persistUiState) {
      setWebsiteList(this.websiteList)
    }
  }

  getOverIndex(selector: string) {
    queueMicrotask(() => {
      const overIndex = getOverIndex(selector)
      if (this.overIndex === overIndex) {
        return
      }
      this.overIndex = overIndex
    })
  }
}
