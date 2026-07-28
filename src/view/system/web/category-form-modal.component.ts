// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { navStore } from 'src/store/nav.store'
import { $t } from 'src/locale'
import { NavCategory } from 'src/types'
import { IUploadChangePayload } from 'src/components/upload/index.component'
import { WebManagementService } from './web-management.service'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzSwitchModule } from 'ng-zorro-antd/switch'
import { LogoComponent } from 'src/components/logo/logo.component'
import { UploadComponent } from 'src/components/upload/index.component'


/**
 * 分类新增/编辑弹窗（自包含：表单状态、校验、保存）。
 * 父组件通过模板引用调用 open() / openEdit()。
 */
@Component({
  selector: 'app-category-form-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSwitchModule,
    LogoComponent,
    UploadComponent
],
  template: `
    <nz-modal
      [(nzVisible)]="showCreateModal"
      [nzTitle]="isEdit ? $t('_edit') : $t('_add')"
      (nzOnCancel)="open()"
      (nzOnOk)="handleOk()"
      >
      <ng-container *nzModalContent>
        <form nz-form [formGroup]="validateForm">
          <nz-form-item>
            <nz-form-label [nzSpan]="6" nzRequired>分类名称</nz-form-label>
            <nz-form-control [nzSpan]="18" [nzErrorTip]="$t('_requiredName')">
              <input
                formControlName="title"
                nz-input
                [placeholder]="$t('_webTitle')"
                [maxlength]="50"
                />
            </nz-form-control>
          </nz-form-item>
    
          <nz-form-item>
            <nz-form-label [nzSpan]="6" nzRequired>{{
              $t('_onlyOwnVisible')
            }}</nz-form-label>
            <nz-form-control [nzSpan]="18">
              <nz-switch formControlName="ownVisible"></nz-switch>
            </nz-form-control>
          </nz-form-item>
    
          <nz-form-item>
            <nz-form-label [nzSpan]="6">图标地址</nz-form-label>
            <nz-form-control [nzSpan]="18">
              <nz-input-group [nzPrefix]="prefixIcon" [nzSuffix]="suffixIconSearch">
                <input
                  formControlName="icon"
                  nz-input
                  placeholder="用于某些主题icon"
                  />
              </nz-input-group>
    
              <ng-template #prefixIcon>
                @if (iconUrl) {
                  <app-logo [src]="iconUrl" [size]="25" />
                }
              </ng-template>
              <ng-template #suffixIconSearch>
                <app-upload (onChange)="onChangeFile($event)"></app-upload>
              </ng-template>
            </nz-form-control>
          </nz-form-item>
        </form>
      </ng-container>
    </nz-modal>
    `,
})
export class CategoryFormModalComponent {
  /** 当前激活的 tab（0 一级 / 1 二级 / 2 三级） */
  @Input() tabActive = 0
  @Input() oneSelect = ''
  @Input() twoSelect = ''

  $t = $t
  showCreateModal = false
  isEdit = false
  editIdx = 0
  validateForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private webService: WebManagementService
  ) {
    this.validateForm = this.fb.group({
      title: ['', [Validators.required]],
      icon: [''],
      ownVisible: [false],
    })
  }

  private get oneIndex() {
    return navStore
      .websiteList()
      .findIndex((item) => item.title === this.oneSelect)
  }

  private get twoIndex() {
    try {
      const twoTableData =
        navStore
          .websiteList()
          .find((item) => item.title === this.oneSelect)?.nav || []
      return twoTableData.findIndex((item) => item.title === this.twoSelect)
    } catch {
      return -1
    }
  }

  private get categoryPath(): number[] {
    if (this.tabActive === 1) {
      return [this.oneIndex]
    }
    if (this.tabActive === 2) {
      return [this.oneIndex, this.twoIndex]
    }
    return []
  }

  get iconUrl(): string {
    return this.validateForm.get('icon')?.value || ''
  }

  open() {
    // 检测是否有选择
    if (!this.showCreateModal) {
      if (this.tabActive === 1 && !this.oneSelect) {
        return this.message.error($t('_sel1'))
      }
      if (this.tabActive === 2 && !this.twoSelect) {
        return this.message.error($t('_sel2'))
      }
    }

    this.isEdit = false
    this.showCreateModal = !this.showCreateModal
    this.validateForm.reset()
  }

  openEdit(data: NavCategory, editIdx: number) {
    const { title, icon, ownVisible } = data
    this.open()
    this.isEdit = true
    this.editIdx = editIdx
    this.validateForm.get('title')!.setValue(title || '')
    this.validateForm.get('icon')!.setValue(icon || '')
    this.validateForm.get('ownVisible')!.setValue(!!ownVisible)
  }

  onChangeFile(data: IUploadChangePayload) {
    this.validateForm.get('icon')!.setValue(data.cdn)
  }

  handleOk() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty()
      this.validateForm.controls[i].updateValueAndValidity()
    }

    let { title, icon, ownVisible } = this.validateForm.value

    if (!title || !title.trim()) {
      this.message.error('分类名称不能为空')
      return
    }
    title = title.trim()

    const ok = this.webService.saveCategory(
      this.categoryPath,
      this.isEdit ? this.editIdx : null,
      { title, icon, ownVisible }
    )
    if (!ok) {
      return
    }

    this.validateForm.reset()
    this.open()
  }
}
