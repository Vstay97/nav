// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
// Modified by Vstay97, 2026

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message'
import { verifyToken, createBranch } from 'src/api'
import { setToken, removeWebsite } from 'src/utils/user'
import { $t } from 'src/locale'
import { NzModalComponent, NzModalContentDirective } from 'ng-zorro-antd/modal';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
        NzModalComponent,
        NzModalContentDirective,
        NzInputDirective,
        ReactiveFormsModule,
        FormsModule,
        NgIf,
    ],
})
export class LoginComponent implements OnInit {
  @Input() visible: boolean = false
  @Output() onCancel = new EventEmitter()

  $t = $t
  token = ''
  submiting = false

  constructor(private message: NzMessageService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.inputFocus()
  }

  hanldeCancel() {
    this.onCancel.emit()
  }

  inputFocus() {
    setTimeout(() => {
      document.getElementById('loginInput')?.focus?.()
    }, 300)
  }

  onKey(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this.login()
    }
  }

  login() {
    if (!this.token) {
      return this.message.error($t('_pleaseInputToken'))
    }
    const token = this.token.trim()

    this.submiting = true
    verifyToken(token)
      .then(() => {
        setToken(token)
        createBranch('image').finally(() => {
          this.message.success($t('_tokenVerSuc'))
          removeWebsite().finally(() => {
            window.location.reload()
          })
        })
      })
      .catch(() => {
        this.submiting = false
      })
  }
}
