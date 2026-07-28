// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
import { Component, Input } from '@angular/core'
import { ITagProp, IWebTag } from 'src/types'
import { navStore } from 'src/store/nav.store'
import { JumpService } from 'src/services/jump'


@Component({
    selector: 'tag-list',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [],
})
export class TagListComponent {
  @Input() data: IWebTag[] = []

  get tagMap(): ITagProp {
    return navStore.tagMap()
  }

  constructor(public jumpService: JumpService) {}
}
