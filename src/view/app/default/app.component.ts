// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { CommonService } from 'src/services/common'
import { BaseThemeComponent } from '../../base-theme.component'

import { SearchEngineComponent } from '../../../components/search-engine/search-engine.component';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { CardComponent } from '../../../components/card/index.component';
import { FooterComponent } from '../../../components/footer/footer.component';

@Component({
    selector: 'app-home',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
    SearchEngineComponent,
    NzRowDirective,
    NzColDirective,
    CardComponent,
    FooterComponent
],
})
export class WebpComponent extends BaseThemeComponent {
  protected readonly overTypeKey = null

  open: boolean = false

  constructor(commonService: CommonService) {
    super(commonService)
  }

  ngOnInit() {}

  handleCilckNav(index: number) {
    this.commonService.handleCilckTopNav(index)
    this.handleToggleOpen()
  }

  handleToggleOpen() {
    this.open = !this.open
  }
}
