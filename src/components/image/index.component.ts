// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { IImageComponent } from 'src/types'
import { JumpService } from 'src/services/jump'

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-image',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
})
export class ImageComponent {
  @Input() data!: IImageComponent

  constructor(public jumpService: JumpService) {}
}
