// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, EventEmitter, Output } from '@angular/core'
import { $t } from 'src/locale'
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms'
import dayjs from 'dayjs'
import { ComponentType, IHolidayComponent } from 'src/types'
import { NzDrawerComponent, NzDrawerContentDirective } from 'ng-zorro-antd/drawer';
import { NzFormDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';

import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';

@Component({
    selector: 'holiday-drawer',
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
    NzDatePickerComponent,
    NzButtonComponent,
    NzWaveDirective,
    ɵNzTransitionPatchDirective
],
})
export class HolidayDrawerComponent {
  @Output() ok = new EventEmitter<IHolidayComponent & { index: number }>()

  $t = $t
  visible = false
  validateForm!: FormGroup
  index = 0

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      items: this.fb.array([]),
    })
  }

  get items(): FormArray {
    return this.validateForm.get('items') as FormArray
  }

  open(data: IHolidayComponent, idx: number) {
    this.index = idx
    if (data.items) {
      data.items.forEach((item) => {
        ;(this.validateForm.get('items') as FormArray).push(
          this.fb.group({
            url: (item['url'] as string) || '',
            day: String(item['day']),
            title: item['title'] as string,
            date: item['date'] as string,
          })
        )
      })
    }
    this.visible = true
  }

  handleAdd() {
    ;(this.validateForm.get('items') as FormArray).push(
      this.fb.group({
        day: '0',
        url: '',
        title: '',
        date: Date.now(),
      })
    )
  }

  handleClose() {
    this.visible = false
    ;(this.validateForm.get('items') as FormArray).controls = []
  }

  handleSubmit() {
    const values = this.validateForm.value
    const now = dayjs(dayjs().format('YYYY-MM-DD'))
    this.ok.emit({
      type: ComponentType.Holiday,
      id: 0,
      items: [...values.items]
        .filter((item: any) => {
          const day = parseInt(item.day)
          item.day = day || 0
          item.date = dayjs(item.date).format('YYYY-MM-DD')
          let date = dayjs(item.date)
          if (item.day > 0) {
            date = date.add(item.day - 1, 'day')
          }
          if (date.isBefore(now)) {
            return false
          }
          return !!item.title.trim()
        })
        .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf()),
      index: this.index,
    })
    this.handleClose()
  }
}
