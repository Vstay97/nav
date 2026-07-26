// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { CommonService } from 'src/services/common'
import { JumpService } from 'src/services/jump'
import { dialogService } from 'src/services/dialog'
import { NgIf, NgFor } from '@angular/common';
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
        NgIf,
        NzSpinComponent,
        NgFor,
        WebMoreMenuComponent,
        ComponentGroupComponent,
        SearchEngineComponent,
        CardComponent,
        NoDataComponent,
        FooterComponent,
        FixbarComponent,
    ],
})
export class SuperComponent {
  $t = $t

  constructor(
    public commonService: CommonService,
    public jumpService: JumpService
  ) {}

  ngAfterViewInit() {
    if (this.commonService.settings.superOverType === 'ellipsis') {
      this.commonService.getOverIndex('.topnav .over-item')
    }
  }

  ngOnDestroy() {
    this.commonService.overIndex = Number.MAX_SAFE_INTEGER
  }

  openCreateWebModal() {
    dialogService.openCreateWeb({
      threeIndex: this.commonService.selectedIndex,
    })
  }
}
