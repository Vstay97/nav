// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { CommonService } from 'src/services/common'
import { JumpService } from 'src/services/jump'
import { dialogService } from 'src/services/dialog'
import { BaseThemeComponent } from '../base-theme.component'

import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { WebMoreMenuComponent } from '../../components/web-more-menu/index.component';
import { ComponentGroupComponent } from '../../components/component-group/index.component';
import { SearchEngineComponent } from '../../components/search-engine/search-engine.component';
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
    NzSpinComponent,
    WebMoreMenuComponent,
    ComponentGroupComponent,
    SearchEngineComponent,
    CardComponent,
    NoDataComponent,
    FooterComponent,
    FixbarComponent
],
})
export class SuperComponent extends BaseThemeComponent {
  protected readonly overTypeKey = 'superOverType' as const
  protected override overflowSelector = '.topnav .over-item'

  $t = $t

  constructor(
    commonService: CommonService,
    public jumpService: JumpService
  ) {
    super(commonService)
  }

  openCreateWebModal() {
    dialogService.openCreateWeb({
      threeIndex: this.commonService.selectedIndex,
    })
  }
}
