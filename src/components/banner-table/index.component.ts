// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input } from '@angular/core'
import { $t } from 'src/locale'
import { IBannerImage } from 'src/types'
import { IUploadChangePayload } from '../upload/index.component'

import { NzTableComponent, NzTheadComponent, NzTrDirective, NzTbodyComponent } from 'ng-zorro-antd/table';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzPopconfirmDirective } from 'ng-zorro-antd/popconfirm';
import { UploadComponent } from '../upload/index.component';

/**
 * 主题 Banner 图片配置表格（系统设置页 Light/Super/Sim/Side 四个 tab 共用）。
 *
 * 语义约定：原地修改传入的 images 数组（与设置页既有行为一致），
 * 父组件提交时统一过滤空 src 后持久化，无需 Output 回传。
 */
@Component({
    selector: 'app-banner-table',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [
    NzTableComponent,
    NzTheadComponent,
    NzTrDirective,
    NzTbodyComponent,
    NzInputDirective,
    NzPopconfirmDirective,
    UploadComponent
],
})
export class BannerTableComponent {
  @Input() images: IBannerImage[] = []

  $t = $t

  onSrcChange(e: Event, idx: number) {
    const value = (e.target as HTMLInputElement).value.trim()
    this.images[idx].src = value
  }

  onUrlChange(e: Event, idx: number) {
    const value = (e.target as HTMLInputElement).value.trim()
    this.images[idx].url = value
  }

  onUpload(data: IUploadChangePayload, idx: number) {
    this.images[idx].src = data.cdn || ''
  }

  onDelete(idx: number) {
    this.images.splice(idx, 1)
  }

  onAdd() {
    this.images.push({ src: '', url: '' })
  }
}
