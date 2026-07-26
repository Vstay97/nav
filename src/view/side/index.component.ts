// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { INavProps } from 'src/types'
import { isMobile } from 'src/utils'
import { setWebsiteList } from 'src/utils/web'
import { dataProvider } from 'src/providers'
import { navStore } from 'src/store/nav.store'
import { $t } from 'src/locale'
import { CommonService } from 'src/services/common'
import { STORAGE_KEY_MAP } from 'src/constants'
import { NzLayoutComponent, NzSiderComponent, NzContentComponent } from 'ng-zorro-antd/layout';
import { NgIf, NgFor } from '@angular/common';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzMenuDirective, NzSubMenuComponent, NzMenuItemComponent } from 'ng-zorro-antd/menu';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { SwiperComponent } from '../../components/swiper/index.component';
import { ComponentGroupComponent } from '../../components/component-group/index.component';
import { SearchEngineComponent } from '../../components/search-engine/search-engine.component';
import { WebListComponent } from '../../components/web-list/index.component';
import { ToolbarTitleWebComponent } from '../../components/toolbar-title/index.component';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { CardComponent } from '../../components/card/index.component';
import { NoDataComponent } from '../../components/no-data/no-data.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { FixbarComponent } from '../../components/fixbar/index.component';

@Component({
    selector: 'app-side',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [
        NzLayoutComponent,
        NgIf,
        NzSpinComponent,
        NzSiderComponent,
        NzMenuDirective,
        NgFor,
        ɵNzTransitionPatchDirective,
        NzSubMenuComponent,
        NzMenuItemComponent,
        SwiperComponent,
        ComponentGroupComponent,
        SearchEngineComponent,
        NzContentComponent,
        WebListComponent,
        ToolbarTitleWebComponent,
        NzRowDirective,
        NzColDirective,
        CardComponent,
        NoDataComponent,
        FooterComponent,
        FixbarComponent,
    ],
})
export class SideComponent {
  $t = $t
  isCollapsed = isMobile() || navStore.settings().sideCollapsed

  constructor(public commonService: CommonService) {
    const localCollapsed = localStorage.getItem(STORAGE_KEY_MAP.sideCollapsed)
    if (localCollapsed) {
      this.isCollapsed = localCollapsed === 'true'
    }
  }

  get websiteList(): INavProps[] {
    return navStore.websiteList()
  }

  get nzXXl(): number {
    const cardStyle = this.commonService.settings.sideCardStyle
    if (cardStyle === 'original' || cardStyle === 'example') {
      return 4
    }
    return 6
  }

  openMenu(item: any, index: number) {
    this.websiteList.forEach((data, idx) => {
      if (idx === index) {
        data.collapsed = !data.collapsed
      } else {
        data.collapsed = false
      }
    })
    if (dataProvider.persistUiState) {
      setWebsiteList(this.websiteList)
    }
  }

  handleCollapsed() {
    this.isCollapsed = !this.isCollapsed
    localStorage.setItem(
      STORAGE_KEY_MAP.sideCollapsed,
      String(this.isCollapsed)
    )
  }
}
