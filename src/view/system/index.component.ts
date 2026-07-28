// @ts-nocheck
// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
// Modified by Vstay97, 2026

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { isLogin, userLogout } from 'src/utils/user'
import { Router, RouterOutlet } from '@angular/router'
import { VERSION } from 'src/constants'
import { removeDark } from 'src/utils/util'

import { NzLayoutComponent, NzSiderComponent, NzContentComponent } from 'ng-zorro-antd/layout';
import { NzMenuDirective, NzSubMenuComponent, NzMenuItemComponent } from 'ng-zorro-antd/menu';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { LoginComponent } from '../../components/login/login.component';

@Component({
    selector: 'app-system',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: true,
    imports: [
    NzLayoutComponent,
    NzSiderComponent,
    NzMenuDirective,
    ɵNzTransitionPatchDirective,
    NzSubMenuComponent,
    NzMenuItemComponent,
    NzContentComponent,
    NzButtonComponent,
    NzWaveDirective,
    RouterOutlet,
    LoginComponent
],
})
export class SystemComponent {
  $t = $t
  isLogin: boolean = isLogin
  showLoginModal: boolean = !isLogin
  currentMenu: string = ''
  date = document.getElementById('META-NAV')?.dataset?.['date'] || ''
  currentVersionSrc = `https://img.shields.io/badge/current-v${VERSION}-red.svg?longCache=true&style=flat-square`
  constructor(private router: Router) {
    // 解决暗黑模式部分样式不正确问题，后台没有暗黑
    removeDark()
  }

  ngOnInit() {
    const u = window.location.href.split('/')
    this.currentMenu = u.at(-1)
  }

  goBack() {
    this.router.navigate(['/'])
  }

  goRoute(to: string, disabled? = false) {
    if (disabled) {
      return
    }
    this.router.navigate([to])
  }

  logout() {
    userLogout()
    this.router.navigate(['/'])
    setTimeout(() => {
      location.reload()
    }, 26)
  }
}
