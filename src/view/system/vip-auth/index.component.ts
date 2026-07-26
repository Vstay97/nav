// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import { setAuthCode, getAuthCode, removeAuthCode } from 'src/utils/user'
import { getUserInfo, updateUserInfo } from 'src/api'
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NgIf } from '@angular/common';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';

@Component({
    selector: 'user-collect',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [
        NzSpinComponent,
        NgIf,
        NzInputDirective,
        ReactiveFormsModule,
        FormsModule,
        NzButtonComponent,
        NzWaveDirective,
        ɵNzTransitionPatchDirective,
    ],
})
export class VipAuthComponent {
  $t = $t
  submitting: boolean = false
  isPermission = !!getAuthCode()
  authCode = ''
  url = ''

  constructor(private message: NzMessageService) {}

  ngOnInit() {
    this.getUserInfo()
  }

  async getUserInfo(params?: any) {
    this.submitting = true
    return getUserInfo(params)
      .then((res: any) => {
        if (typeof res.data?.data?.url === 'string') {
          this.isPermission = true
          this.url = res.data.data.url
        }
        return res
      })
      .finally(() => {
        this.submitting = false
      })
  }

  handleSubmitAuthCode() {
    if (this.submitting || !this.authCode) {
      return
    }

    this.getUserInfo({ code: this.authCode }).then(() => {
      setAuthCode(this.authCode)
      window.location.reload()
    })
  }

  handleSave() {
    this.submitting = true
    updateUserInfo({
      url: this.url,
    })
      .then(() => {
        this.getUserInfo()
        this.message.success(this.$t('_saveSuccess'))
      })
      .finally(() => {
        this.submitting = false
      })
  }

  logoutAuthCode() {
    removeAuthCode()
    window.location.reload()
  }
}
