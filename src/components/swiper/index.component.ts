// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { JumpService } from 'src/services/jump'
import { NgIf, NgStyle, NgFor } from '@angular/common';
import { NzCarouselComponent, NzCarouselContentDirective } from 'ng-zorro-antd/carousel';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-swiper',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NgStyle,
        NzCarouselComponent,
        NgFor,
        NzCarouselContentDirective,
    ],
})
export class SwiperComponent {
  @Input() images: any[] = []
  @Input() autoplay = true
  @Input() height = 300

  constructor(public jumpService: JumpService) {}
}
