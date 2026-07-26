// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core'
import { INavThreeProp, INavProps, ISettings } from 'src/types'
import { isLogin } from 'src/utils/user'
import { navStore } from 'src/store/nav.store'
import { dialogService } from 'src/services/dialog'
import { NgIf } from '@angular/common';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzIconDirective } from 'ng-zorro-antd/icon';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-toolbar-title',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        ɵNzTransitionPatchDirective,
        NzIconDirective,
    ],
})
export class ToolbarTitleWebComponent implements OnInit {
  @Input() index: number = 0
  @Input() dataSource!: INavThreeProp
  @Output() onCollapse = new EventEmitter()

  isLogin = isLogin

  get websiteList(): INavProps[] {
    return navStore.websiteList()
  }

  get settings(): ISettings {
    return navStore.settings()
  }

  constructor() {}

  ngOnInit() {}

  openCreateWebModal() {
    dialogService.openCreateWeb({
      threeIndex: this.index,
    })
  }
}
