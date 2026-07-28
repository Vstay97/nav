// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
// Modified by Vstay97, 2026

import { Component, ViewChild } from '@angular/core'
import {
  INavProps,
  INavTwoProp,
  INavThreeProp,
  IWebProps,
  ISettings,
  internalProps,
  NavNode,
} from 'src/types'
import { navStore } from 'src/store/nav.store'
import { isLogin } from 'src/utils/user'
import { NzMessageService } from 'ng-zorro-antd/message'
import { $t } from 'src/locale'
import { dialogService } from 'src/services/dialog'
import config from '../../../../nav.config.json'
import { WebManagementService } from './web-management.service'
import { CategoryFormModalComponent } from './category-form-modal.component'
import { CategoryTableComponent } from './category-table.component'

import { FormsModule } from '@angular/forms'
import { NzButtonComponent } from 'ng-zorro-antd/button'
import { NzWaveDirective } from 'ng-zorro-antd/core/wave'
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch'
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip'
import { NzTabSetComponent, NzTabComponent } from 'ng-zorro-antd/tabs'
import { NzPopconfirmDirective } from 'ng-zorro-antd/popconfirm'
import {
  NzTableComponent,
  NzTheadComponent,
  NzTrDirective,
  NzTableCellDirective,
  NzThMeasureDirective,
  NzThSelectionComponent,
  NzTbodyComponent,
  NzTdAddOnComponent,
} from 'ng-zorro-antd/table'
import { LogoComponent } from '../../../components/logo/logo.component'
import { NzIconDirective } from 'ng-zorro-antd/icon'
import { NzSelectComponent, NzOptionComponent } from 'ng-zorro-antd/select'
import { TagListComponent } from '../../../components/tag-list/index.component'

@Component({
  selector: 'app-admin',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
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
    NzTdAddOnComponent,
    LogoComponent,
    NzIconDirective,
    NzSelectComponent,
    NzOptionComponent,
    TagListComponent,
    CategoryFormModalComponent,
    CategoryTableComponent
],
})
export class SystemWebComponent {
  @ViewChild('formModal') formModal!: CategoryFormModalComponent

  $t = $t
  gitRepoUrl = config.gitRepoUrl
  isLogin = isLogin
  syncLoading = false
  uploading = false
  tabActive = 0
  oneSelect = ''
  twoSelect = ''
  threeSelect = ''
  checkedAll = false
  setOfCheckedId = new Set<string>()
  errorWebs: IWebProps[] = []

  get websiteList(): INavProps[] {
    return navStore.websiteList()
  }

  get settings(): ISettings {
    return navStore.settings()
  }

  get internal(): internalProps {
    return navStore.internal()
  }

  constructor(
    private message: NzMessageService,
    public webService: WebManagementService
  ) {}

  private findIndexByTitle(list: Array<{ title?: string }>, title: string) {
    try {
      return list.findIndex((item) => item.title === title)
    } catch {
      return -1
    }
  }

  get oneIndex() {
    return this.findIndexByTitle(this.websiteList, this.oneSelect)
  }

  get twoIndex() {
    return this.findIndexByTitle(this.twoTableData, this.twoSelect)
  }

  get threeIndex() {
    return this.findIndexByTitle(this.threeTableData, this.threeSelect)
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
    const lists: Record<number, Array<{ title?: string; name?: string }>> = {
      1: this.websiteList,
      2: this.twoTableData,
      3: this.threeTableData,
      4: this.websiteTableData,
    }
    const key: 'title' | 'name' = type === 4 ? 'name' : 'title'
    lists[type].forEach((item) => {
      const id = item[key]
      if (id == null) {
        return
      }
      if (checked) {
        this.setOfCheckedId.add(id)
      } else {
        this.setOfCheckedId.delete(id)
      }
    })
  }

  onItemChecked(idStr: string, checked: boolean) {
    if (checked) {
      this.setOfCheckedId.add(idStr)
    } else {
      this.setOfCheckedId.delete(idStr)
    }
  }

  onBatchDelete(type: 1 | 2 | 3 | 4) {
    if (type <= 3) {
      const path =
        type === 1
          ? []
          : type === 2
          ? [this.oneIndex]
          : [this.oneIndex, this.twoIndex]
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
    this.webService.confirmAndReset()
  }

  handleDownloadBackup() {
    this.webService.downloadBackup()
  }

  handleUploadBackup(e: Event) {
    const files = (e.target as HTMLInputElement).files
    if (!files || files.length <= 0) return
    this.webService.uploadBackupFile(files[0])
  }

  goBack() {
    history.go(-1)
  }

  openMoveWebModal(data: NavNode, index: number, level?: number) {
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
    dialogService.openCreateWeb({ detail })
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

  handleConfirmDelWebsite(data: IWebProps, idx: number) {
    const ok = this.webService.deleteWeb(data)
    if (ok && this.errorWebs.length) {
      this.getAllErrorWeb()
    }
  }

  hanldeOneSelect(value?: string) {
    this.oneSelect = value ?? this.oneSelect
    this.twoSelect = ''
    this.threeSelect = ''
    this.onTabChange()
  }

  hanldeTwoSelect(value?: string) {
    this.twoSelect = value ?? this.twoSelect
    this.threeSelect = ''
    this.onTabChange()
  }

  hanldeThreeSelect(value?: string) {
    this.threeSelect = value ?? this.threeSelect
    this.onTabChange()
  }

  handleSync() {
    this.webService.confirmAndSync((loading) => {
      this.syncLoading = loading
    })
  }
}
