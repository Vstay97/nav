// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { randomBgImg } from 'src/utils'
import { CommonService } from 'src/services/common'
import { JumpService } from 'src/services/jump'
import { BaseThemeComponent } from '../base-theme.component'
import { NgIf, NgFor } from '@angular/common';
import { ComponentGroupComponent } from '../../components/component-group/index.component';
import { WebMoreMenuComponent } from '../../components/web-more-menu/index.component';
import { SearchEngineComponent } from '../../components/search-engine/search-engine.component';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { ToolbarTitleWebComponent } from '../../components/toolbar-title/index.component';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { CardComponent } from '../../components/card/index.component';
import { NoDataComponent } from '../../components/no-data/no-data.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { FixbarComponent } from '../../components/fixbar/index.component';

@Component({
    selector: 'app-light',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        ComponentGroupComponent,
        NgFor,
        WebMoreMenuComponent,
        SearchEngineComponent,
        NzSpinComponent,
        ToolbarTitleWebComponent,
        NzRowDirective,
        NzColDirective,
        CardComponent,
        NoDataComponent,
        FooterComponent,
        FixbarComponent,
    ],
})
export class LightComponent extends BaseThemeComponent {
  protected readonly overTypeKey = 'lightOverType' as const

  constructor(
    commonService: CommonService,
    public jumpService: JumpService
  ) {
    super(commonService)
  }

  ngOnInit() {
    randomBgImg()
  }
}
