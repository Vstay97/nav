// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { navStore } from 'src/store/nav.store'
import { dialogService } from 'src/services/dialog'
import { compilerTemplate } from 'src/utils/util'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input() className: string = ''
  @Input() content: string = ''

  footerContent: string = ''

  constructor() {}

  ngOnInit() {
    this.footerContent = compilerTemplate(
      this.content || navStore.settings().footerContent
    )
  }

  ngOnDestroy() {
    const applyWebEls = document.querySelectorAll('#app-footer .applyweb')
    applyWebEls.forEach((el) => {
      el.removeEventListener('click', this.handleApplyWeb)
    })
  }

  handleApplyWeb() {
    dialogService.openCreateWeb()
  }

  ngAfterViewInit() {
    const applyWebEls = document.querySelectorAll('#app-footer .applyweb')
    applyWebEls.forEach((el) => {
      el.addEventListener('click', this.handleApplyWeb)
    })
  }
}
