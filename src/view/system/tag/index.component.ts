// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
// Modified by Vstay97, 2026

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzModalService } from 'ng-zorro-antd/modal'
import { ITagPropValues } from 'src/types'
import { dataProvider } from 'src/providers'
import { TAG_PATH } from 'src/constants'
import { navStore } from 'src/store/nav.store'
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';

import { NzTableComponent, NzTheadComponent, NzTrDirective, NzTableCellDirective, NzThMeasureDirective, NzTbodyComponent } from 'ng-zorro-antd/table';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzPopconfirmDirective } from 'ng-zorro-antd/popconfirm';

@Component({
    selector: 'system-tag',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [
    NzButtonComponent,
    NzWaveDirective,
    ɵNzTransitionPatchDirective,
    NzTableComponent,
    NzTheadComponent,
    NzTrDirective,
    NzTableCellDirective,
    NzThMeasureDirective,
    NzTbodyComponent,
    NzInputDirective,
    ReactiveFormsModule,
    FormsModule,
    NzPopconfirmDirective
],
})
export class SystemTagComponent {
  $t = $t
  submitting: boolean = false
  incrementId =
    Math.max(...navStore.tagList().map((item) => Number(item.id))) + 1

  get tagList(): ITagPropValues[] {
    return navStore.tagList()
  }

  constructor(
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {}

  onColorChange(e: Event, idx: number) {
    const color = (e.target as HTMLInputElement).value
    this.tagList[idx].color = color
  }

  handleAdd() {
    const isEmpty = this.tagList.some((item) => !item.name.trim())
    if (isEmpty) {
      return
    }
    this.incrementId += 1
    this.tagList.unshift({
      id: this.incrementId,
      name: '',
      createdAt: '',
      color: '#f50000',
      desc: '',
      isInner: false,
    })
  }

  handleDelete(idx: number) {
    this.tagList.splice(idx, 1)
  }

  handleSubmit() {
    if (this.submitting) {
      return
    }

    // 去重
    const o: Record<string, unknown> = {}
    this.tagList.forEach((item: ITagPropValues) => {
      if (item.name?.trim?.()) {
        o[item.name] = {
          ...item,
          name: undefined,
        }
      }
    })

    if (Object.keys(o).length !== this.tagList.length) {
      this.message.error($t('_repeatAdd'))
      return
    }

    this.modal.info({
      nzTitle: $t('_syncDataOut'),
      nzOkText: $t('_confirmSync'),
      nzContent: $t('_confirmSyncTip'),
      nzOnOk: () => {
        this.submitting = true
        dataProvider.updateFileContent({
          message: 'update tag',
          content: JSON.stringify(this.tagList),
          path: TAG_PATH,
        })
          .then(() => {
            this.message.success($t('_saveSuccess'))
          })
          .finally(() => {
            this.submitting = false
          })
      },
    })
  }

  trackByItem(index: number, item: ITagPropValues) {
    return item.id
  }
}
