// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, EventEmitter, Output } from '@angular/core'
import { $t } from 'src/locale'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import dayjs from 'dayjs'
import { NzDrawerComponent, NzDrawerContentDirective } from 'ng-zorro-antd/drawer';
import { NzFormDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { NzColorPickerComponent } from 'ng-zorro-antd/color-picker';
import { NzInputDirective, NzInputGroupComponent, NzInputGroupWhitSuffixOrPrefixDirective } from 'ng-zorro-antd/input';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { UploadComponent } from '../../upload/index.component';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';

@Component({
    selector: 'countdown-drawer',
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
        NzColorPickerComponent,
        NzInputDirective,
        NzInputGroupComponent,
        ɵNzTransitionPatchDirective,
        NzInputGroupWhitSuffixOrPrefixDirective,
        UploadComponent,
        NzDatePickerComponent,
        NzButtonComponent,
        NzWaveDirective,
    ],
})
export class CountdownDrawerComponent {
  @Output() ok = new EventEmitter<void>()

  $t = $t
  visible = false
  validateForm!: FormGroup
  index = 0

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      topColor: [''],
      bgColor: [''],
      title: [''],
      url: [''],
      dateColor: [''],
      dayColor: [''],
      date: [null],
    })
  }

  open(data: any, idx: number) {
    this.index = idx
    for (const k in data) {
      this.validateForm.get(k)!?.setValue(data[k])
    }
    this.visible = true
  }

  onUploadImage(data: any) {
    this.validateForm.get('url')!.setValue(data.cdn)
  }

  handleClose() {
    this.visible = false
  }

  handleSubmit() {
    const values = this.validateForm.value
    this.ok.emit({
      ...values,
      date: dayjs(values.date).format('YYYY-MM-DD'),
      index: this.index,
    })
    this.handleClose()
  }
}
