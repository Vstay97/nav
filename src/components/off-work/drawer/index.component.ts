// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, EventEmitter, Output } from '@angular/core'
import { $t } from 'src/locale'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { ComponentType, IOffWorkComponent } from 'src/types'
import { NzDrawerComponent, NzDrawerContentDirective } from 'ng-zorro-antd/drawer';
import { NzFormDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzTimePickerComponent } from 'ng-zorro-antd/time-picker';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';

@Component({
    selector: 'offwork-drawer',
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
        NzInputDirective,
        NzTimePickerComponent,
        NzButtonComponent,
        NzWaveDirective,
        ɵNzTransitionPatchDirective,
    ],
})
export class OffWorkDrawerComponent {
  @Output() ok = new EventEmitter<IOffWorkComponent & { index: number }>()

  $t = $t
  visible = false
  validateForm!: FormGroup
  index = 0

  constructor(private fb: FormBuilder, private message: NzMessageService) {
    this.validateForm = this.fb.group({
      workTitle: [''],
      restTitle: [''],
      startDate: [null],
      date: [null],
    })
  }

  open(data: IOffWorkComponent, idx: number) {
    this.index = idx
    for (const k in data) {
      this.validateForm.get(k)!?.setValue(data[k as keyof IOffWorkComponent])
    }
    this.visible = true
  }

  handleClose() {
    this.visible = false
  }

  handleSubmit() {
    const values = this.validateForm.value
    const startDate = new Date(values.startDate).getTime()
    const date = new Date(values.date).getTime()
    if (startDate >= date) {
      return this.message.error('休息时间需要比工作时间大')
    }
    this.ok.emit({
      type: ComponentType.OffWork,
      id: 0,
      ...values,
      startDate,
      date,
      index: this.index,
    })
    this.handleClose()
  }
}
