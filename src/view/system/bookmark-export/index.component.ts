// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
// Modified by Vstay97, 2026

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { INavProps } from 'src/types'
import { navStore } from 'src/store/nav.store'
import { generateBookmarkHtml } from 'src/utils/bookmark'
import { saveAs } from 'file-saver'

@Component({
    selector: 'system-bookmark-export',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [],
})
export class SystemBookmarkExportComponent {
  $t = $t

  get websiteList(): INavProps[] {
    return navStore.websiteList()
  }

  get hasWebs(): boolean {
    return this.websiteList.some((one) =>
      (one.nav || []).some((two) =>
        (two.nav || []).some((three: any) => (three.nav || []).length > 0)
      )
    )
  }

  constructor(private notification: NzNotificationService) {}

  bookmarksExport() {
    if (!this.hasWebs) {
      return
    }
    const html = generateBookmarkHtml(this.websiteList)
    const fileName = '我的导航书签.html'
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    saveAs(blob, fileName)
    this.notification.success('导出成功', fileName, { nzDuration: 0 })
  }
}
