// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.

import { Component } from '@angular/core'
import { isLogin } from 'src/utils/user'
import { navStore } from 'src/store/nav.store'
import { CommonService } from 'src/services/common'
import { BaseThemeComponent } from '../base-theme.component'

import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { SwiperComponent } from '../../components/swiper/index.component';
import { ComponentGroupComponent } from '../../components/component-group/index.component';
import { SearchEngineComponent } from '../../components/search-engine/search-engine.component';
import { WebMoreMenuComponent } from '../../components/web-more-menu/index.component';
import { ToolbarTitleWebComponent } from '../../components/toolbar-title/index.component';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { CardComponent } from '../../components/card/index.component';
import { NoDataComponent } from '../../components/no-data/no-data.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { FixbarComponent } from '../../components/fixbar/index.component';
import { SafeHtmlPipe } from 'src/pipe/safeHtml.pipe';

@Component({
    selector: 'app-sim',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [
    NzSpinComponent,
    SwiperComponent,
    ComponentGroupComponent,
    SearchEngineComponent,
    WebMoreMenuComponent,
    ToolbarTitleWebComponent,
    NzRowDirective,
    NzColDirective,
    CardComponent,
    NoDataComponent,
    FooterComponent,
    FixbarComponent,
    SafeHtmlPipe
],
})
export class SimComponent extends BaseThemeComponent {
  protected readonly overTypeKey = 'simOverType' as const

  get description(): string {
    const internal = navStore.internal()
    return navStore
      .settings()
      .simThemeDesc.replace(
        '${total}',
        String(isLogin ? internal.loginViewCount : internal.userViewCount)
      )
  }

  constructor(commonService: CommonService) {
    super(commonService)
  }
}
