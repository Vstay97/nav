// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, EventEmitter, Output } from '@angular/core'
import { $t } from 'src/locale'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { ComponentType, IImageComponent } from 'src/types'
import { IUploadChangePayload } from 'src/components/upload/index.component'
import { NzDrawerComponent, NzDrawerContentDirective } from 'ng-zorro-antd/drawer';
import { NzFormDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { NzInputGroupComponent, NzInputGroupWhitSuffixOrPrefixDirective, NzInputDirective } from 'ng-zorro-antd/input';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { UploadComponent } from '../../upload/index.component';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';

@Component({
    selector: 'image-drawer',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [
        NzDrawerComponent,
        NzDrawerContentDirective,
        ReactiveFormsModule,
        NzFormDirective,
        NzRowDirective,
        NzFormItemComponent,
        NzColDirective,
        NzFormLabelComponent,
        NzFormControlComponent,
        NzInputGroupComponent,
        ɵNzTransitionPatchDirective,
        NzInputGroupWhitSuffixOrPrefixDirective,
        NzInputDirective,
        UploadComponent,
        NzButtonComponent,
        NzWaveDirective,
    ],
})
export class ImageDrawerComponent {
  @Output() ok = new EventEmitter<IImageComponent & { index: number }>()

  $t = $t
  visible = false
  validateForm!: FormGroup
  index = 0

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      url: [''],
      text: [''],
      go: [''],
    })
  }

  open(data: IImageComponent, idx: number) {
    this.index = idx
    for (const k in data) {
      this.validateForm.get(k)!?.setValue(data[k as keyof IImageComponent])
    }
    this.visible = true
  }

  onUploadImage(data: IUploadChangePayload) {
    this.validateForm.get('url')!.setValue(data.cdn)
  }

  handleClose() {
    this.visible = false
  }

  handleSubmit() {
    const values = this.validateForm.value
    this.ok.emit({
      type: ComponentType.Image,
      id: 0,
      ...values,
      index: this.index,
    })
    this.handleClose()
  }
}
