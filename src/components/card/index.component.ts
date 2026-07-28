// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core'
import { isLogin } from 'src/utils/user'
import { copyText, getTextContent } from 'src/utils'
import { setWebsiteList, deleteByWeb } from 'src/services/web-tree'
import { IWebProps, ICardType } from 'src/types'
import { $t } from 'src/locale'
import { dialogService } from 'src/services/dialog'
import { JumpService } from 'src/services/jump'

import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzRateComponent } from 'ng-zorro-antd/rate';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LogoComponent } from '../logo/logo.component';
import { TagListComponent } from '../tag-list/index.component';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmDirective } from 'ng-zorro-antd/popconfirm';
import { SafeHtmlPipe } from 'src/pipe/safeHtml.pipe';
import { TiltDirective } from '../effects/tilt.directive';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-card',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [
    ɵNzTransitionPatchDirective,
    NzIconDirective,
    NzRateComponent,
    ReactiveFormsModule,
    FormsModule,
    LogoComponent,
    TagListComponent,
    NzTooltipDirective,
    NzPopconfirmDirective,
    SafeHtmlPipe,
    TiltDirective
],
})
export class CardComponent implements OnInit {
  @Input() searchKeyword: string = ''
  @Input() dataSource: IWebProps | Record<string, any> = {}
  @Input() indexs: Array<number> = []
  @Input() cardStyle: ICardType = 'standard'
  @Input() showRate: boolean = false

  $t = $t
  isLogin: boolean = isLogin
  copyUrlDone = false
  copyPathDone = false

  constructor(public jumpService: JumpService) {}

  ngOnInit(): void {}

  async copyUrl(e: Event, type: number) {
    const w = this.dataSource
    const { origin, hash, pathname } = window.location
    const pathUrl = `${origin}${pathname}${hash}?q=${
      w.name
    }&url=${encodeURIComponent(w.url)}`
    const isDone = await copyText(e, type === 1 ? pathUrl : w.url)

    if (type === 1) {
      this.copyPathDone = isDone
    } else {
      this.copyUrlDone = isDone
    }
  }

  copyMouseout() {
    this.copyUrlDone = false
    this.copyPathDone = false
  }

  openEditWebMoal() {
    dialogService.openCreateWeb({
      detail: this.dataSource as IWebProps,
    })
  }

  onRateChange(n: number) {
    this.dataSource.rate = n
    setWebsiteList()
  }

  confirmDel() {
    deleteByWeb({
      ...(this.dataSource as IWebProps),
      name: getTextContent(this.dataSource.name),
      desc: getTextContent(this.dataSource.desc),
    })
  }

  openMoveWebModal() {
    dialogService.openMoveWeb({
      indexs: this.indexs,
      data: [this.dataSource as IWebProps],
    })
  }

  get html() {
    return this.dataSource.desc.slice(1)
  }

  get getRate() {
    if (!this.dataSource.rate) {
      return null
    }
    const rate = Number(this.dataSource.rate)
    // 0分不显示
    if (!rate) {
      return null
    }
    return rate.toFixed(1) + '分'
  }
}
