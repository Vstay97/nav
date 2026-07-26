// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import {
  INavProps,
  INavTwoProp,
  INavThreeProp,
  IWebProps,
  ISettings,
} from 'src/types'
import { navStore } from 'src/store/nav.store'
import { isLogin } from 'src/utils/user'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzModalService, NzModalComponent, NzModalContentDirective } from 'ng-zorro-antd/modal'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms'
import { $t } from 'src/locale'
import { isSelfDevelop } from 'src/utils/util'
import { dialogService } from 'src/services/dialog'
import config from '../../../../nav.config.json'
import { WebManagementService } from './web-management.service'
import { NgIf, NgFor } from '@angular/common';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { NzTabSetComponent, NzTabComponent } from 'ng-zorro-antd/tabs';
import { NzPopconfirmDirective } from 'ng-zorro-antd/popconfirm';
import { NzTableComponent, NzTheadComponent, NzTrDirective, NzTableCellDirective, NzThMeasureDirective, NzThSelectionComponent, NzTbodyComponent, NzTdAddOnComponent } from 'ng-zorro-antd/table';
import { LogoComponent } from '../../../components/logo/logo.component';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzSelectComponent, NzOptionComponent } from 'ng-zorro-antd/select';
import { TagListComponent } from '../../../components/tag-list/index.component';
import { NzFormDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { NzInputDirective, NzInputGroupComponent, NzInputGroupWhitSuffixOrPrefixDirective } from 'ng-zorro-antd/input';
import { NzSwitchComponent } from 'ng-zorro-antd/switch';
import { UploadComponent } from '../../../components/upload/index.component';

@Component({
    selector: 'app-admin',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NzButtonComponent,
        NzWaveDirective,
        ɵNzTransitionPatchDirective,
        NzTooltipDirective,
        NzTabSetComponent,
        NzTabComponent,
        NzPopconfirmDirective,
        NzTableComponent,
        NzTheadComponent,
        NzTrDirective,
        NzTableCellDirective,
        NzThMeasureDirective,
        NzThSelectionComponent,
        NzTbodyComponent,
        NgFor,
        NzTdAddOnComponent,
        LogoComponent,
        NzIconDirective,
        NzSelectComponent,
        ReactiveFormsModule,
        FormsModule,
        NzOptionComponent,
        TagListComponent,
        NzModalComponent,
        NzModalContentDirective,
        NzFormDirective,
        NzRowDirective,
        NzFormItemComponent,
        NzColDirective,
        NzFormLabelComponent,
        NzFormControlComponent,
        NzInputDirective,
        NzSwitchComponent,
        NzInputGroupComponent,
        NzInputGroupWhitSuffixOrPrefixDirective,
        UploadComponent,
    ],
})
export class SystemWebComponent {
  $t = $t
  isSelfDevelop = isSelfDevelop
  validateForm!: FormGroup
  gitRepoUrl = config.gitRepoUrl
  isLogin = isLogin
  showCreateModal = false
  syncLoading = false
  uploading = false
  tabActive = 0
  editIdx = 0
  isEdit = false
  oneSelect = ''
  twoSelect = ''
  threeSelect = ''

  checkedAll = false
  setOfCheckedId = new Set<string>()
  errorWebs: IWebProps[] = []

  get settings(): ISettings {
    return navStore.settings()
  }

  get internal() {
    return navStore.internal()
  }

  get websiteList(): INavProps[] {
    return navStore.websiteList()
  }

  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private webService: WebManagementService
  ) {
    this.validateForm = this.fb.group({
      title: ['', [Validators.required]],
      icon: [''],
      ownVisible: [false],
    })
  }

  ngOnInit() {}

  get oneIndex() {
    return this.websiteList.findIndex((item) => item.title === this.oneSelect)
  }

  get twoIndex() {
    try {
      return this.twoTableData.findIndex(
        (item) => item.title === this.twoSelect
      )
    } catch {
      return -1
    }
  }

  get threeIndex() {
    try {
      return this.threeTableData.findIndex(
        (item) => item.title === this.threeSelect
      )
    } catch {
      return -1
    }
  }

  get twoTableData(): INavTwoProp[] {
    try {
      return (
        this.websiteList.find((item) => item.title === this.oneSelect)?.nav ||
        []
      )
    } catch {
      return []
    }
  }

  get threeTableData(): INavThreeProp[] {
    try {
      return (
        this.twoTableData.find((item) => item.title === this.twoSelect)?.nav ||
        []
      )
    } catch {
      return []
    }
  }

  get websiteTableData(): IWebProps[] {
    try {
      const data = this.threeTableData.find(
        (item) => item.title === this.threeSelect
      )
      if (data) {
        return data.nav
      }
      return this.errorWebs
    } catch {
      return this.errorWebs
    }
  }

  /** tabActive(0/1/2) → 分类索引路径（一级/二级/三级） */
  private get categoryPath(): number[] {
    if (this.tabActive === 1) {
      return [this.oneIndex]
    }
    if (this.tabActive === 2) {
      return [this.oneIndex, this.twoIndex]
    }
    return []
  }

  getAllErrorWeb() {
    this.oneSelect = ''
    this.twoSelect = ''
    this.threeSelect = ''
    this.onTabChange()
    const errorWebs = this.webService.collectErrorWebs()
    this.errorWebs = errorWebs
    if (errorWebs.length <= 0) {
      this.message.success('No error!')
    } else {
      this.message.warning(`检测出 ${errorWebs.length} 个网站疑似异常`)
    }
  }

  onAllChecked(checked: boolean, type: 1 | 2 | 3 | 4) {
    this.setOfCheckedId.clear()
    const lists: Record<number, any[]> = {
      1: this.websiteList,
      2: this.twoTableData,
      3: this.threeTableData,
      4: this.websiteTableData,
    }
    const key: 'title' | 'name' = type === 4 ? 'name' : 'title'
    lists[type].forEach((item) => {
      if (checked) {
        this.setOfCheckedId.add(item[key])
      } else {
        this.setOfCheckedId.delete(item[key])
      }
    })
  }

  onItemChecked(idStr: any, checked: boolean) {
    if (checked) {
      this.setOfCheckedId.add(idStr)
    } else {
      this.setOfCheckedId.delete(idStr)
    }
  }

  onBatchDelete(type: 1 | 2 | 3 | 4) {
    if (type <= 3) {
      const path = type === 1 ? [] : type === 2 ? [this.oneIndex] : [this.oneIndex, this.twoIndex]
      if (type > 1 && this.oneIndex < 0) {
        // 与原实现一致：父索引无效时跳过
      } else {
        this.webService.deleteCategoriesBatch(path, this.setOfCheckedId)
      }
    } else {
      const deleteData = this.websiteTableData.filter((item) =>
        this.setOfCheckedId.has(item.name)
      )
      this.webService.deleteWebs(deleteData)
      if (this.errorWebs.length) {
        this.getAllErrorWeb()
      }
    }
    this.onTabChange()
    this.setOfCheckedId.clear()
  }

  handleReset() {
    this.modal.info({
      nzTitle: $t('_resetInitData'),
      nzContent: $t('_warnReset'),
      nzOnOk: () => {
        this.webService.resetLocalData()
      },
    })
  }

  handleDownloadBackup() {
    this.webService.downloadBackup()
  }

  handleUploadBackup(e: any) {
    const files = e.target.files
    if (files.length <= 0) {
      return
    }
    this.webService.uploadBackupFile(files[0])
  }

  goBack() {
    history.go(-1)
  }

  openMoveWebModal(data: any, index: number, level?: number) {
    dialogService.openMoveWeb({
      indexs: [this.oneIndex, this.twoIndex, this.threeIndex, index],
      data: [data],
      level,
    })
  }

  openCreateWebModal() {
    if (this.tabActive === 3 && !this.threeSelect) {
      return this.message.error($t('_sel3'))
    }
    dialogService.openCreateWeb({
      oneIndex: this.oneIndex,
      twoIndex: this.twoIndex,
      threeIndex: this.threeIndex,
    })
  }

  openEditModal(detail: IWebProps) {
    dialogService.openCreateWeb({
      detail,
    })
  }

  toggleCreateModal() {
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

  onTabChange(index?: number) {
    this.errorWebs = []
    this.tabActive = index ?? this.tabActive
    this.setOfCheckedId.clear()
    // Fuck hack
    if (!this.checkedAll) {
      setTimeout(() => {
        this.checkedAll = !this.checkedAll
        setTimeout(() => {
          this.checkedAll = !this.checkedAll
        })
      })
    }
  }

  // 删除一级分类
  handleConfirmDelOne(idx: number) {
    this.webService.deleteCategoryAt([], idx)
  }

  // 删除二级分类
  handleConfirmDelTwo(idx: number) {
    this.webService.deleteCategoryAt([this.oneIndex], idx)
  }

  // 删除三级分类
  handleConfirmDelThree(idx: number) {
    this.webService.deleteCategoryAt([this.oneIndex, this.twoIndex], idx)
  }

  // 上移/下移一级
  moveOneUp(index: number): void {
    this.webService.moveItem([], index, -1)
  }

  moveOneDown(index: number): void {
    this.webService.moveItem([], index, 1)
  }

  // 上移/下移二级
  moveTwoUp(index: number): void {
    this.webService.moveItem([this.oneIndex], index, -1)
  }

  moveTwoDown(index: number): void {
    this.webService.moveItem([this.oneIndex], index, 1)
  }

  // 上移/下移三级
  moveThreeUp(index: number): void {
    this.webService.moveItem([this.oneIndex, this.twoIndex], index, -1)
  }

  moveThreeDown(index: number): void {
    this.webService.moveItem([this.oneIndex, this.twoIndex], index, 1)
  }

  // 上移/下移网站
  moveWebUp(index: number): void {
    this.webService.moveItem(
      [this.oneIndex, this.twoIndex, this.threeIndex],
      index,
      -1
    )
  }

  moveWebDown(index: number): void {
    this.webService.moveItem(
      [this.oneIndex, this.twoIndex, this.threeIndex],
      index,
      1
    )
  }

  // 删除网站
  handleConfirmDelWebsite(data: any, idx: number) {
    const ok = this.webService.deleteWeb(data)
    if (ok && this.errorWebs.length) {
      this.getAllErrorWeb()
    }
  }

  hanldeOneSelect(value?: any) {
    this.oneSelect = value ?? this.oneSelect
    this.twoSelect = ''
    this.threeSelect = ''
    this.onTabChange()
  }

  hanldeTwoSelect(value?: any) {
    this.twoSelect = value ?? this.twoSelect
    this.threeSelect = ''
    this.onTabChange()
  }

  hanldeThreeSelect(value?: any) {
    this.threeSelect = value ?? this.threeSelect
    this.onTabChange()
  }

  handleEditBtn(data: any, editIdx: number) {
    let { title, icon, name, ownVisible } = data
    this.toggleCreateModal()
    this.isEdit = true
    this.editIdx = editIdx
    this.validateForm.get('title')!.setValue(title || name || '')
    this.validateForm.get('icon')!.setValue(icon || '')
    this.validateForm.get('ownVisible')!.setValue(!!ownVisible)
  }

  onChangeFile(data: any) {
    this.validateForm.get('icon')!.setValue(data.cdn)
  }

  get iconUrl(): string {
    return this.validateForm.get('icon')?.value || ''
  }

  handleSync() {
    this.modal.info({
      nzTitle: $t('_syncDataOut'),
      nzOkText: $t('_confirmSync'),
      nzContent: $t('_confirmSyncTip'),
      nzOnOk: () => {
        this.syncLoading = true
        this.webService
          .syncToRemote()
          .then(() => {
            this.message.success($t('_syncSuccessTip'))
          })
          .finally(() => {
            this.syncLoading = false
          })
      },
    })
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
    this.toggleCreateModal()
  }
}
