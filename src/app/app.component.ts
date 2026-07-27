// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
// Modified by Vstay97, 2026

import { Component } from '@angular/core'
import { Router, ActivatedRoute, NavigationEnd, RouterOutlet } from '@angular/router'
import { queryString, setLocation, isMobile } from '../utils'
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n'
import { getLocale } from 'src/locale'
import { navStore } from 'src/store/nav.store'
import { dataProvider } from 'src/providers'
import { verifyToken } from 'src/api'
import { getToken, userLogout, isLogin } from 'src/utils/user'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { registerNotifyServices } from 'src/services/notify'
import { NgIf } from '@angular/common';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { IconGitComponent } from '../components/icon-git/icon-git.component';
import { CreateWebComponent } from '../components/create-web/index.component';
import { MoveWebComponent } from '../components/move-web/index.component';

@Component({
    selector: 'app-xiejiahe',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NzSpinComponent,
        IconGitComponent,
        RouterOutlet,
        CreateWebComponent,
        MoveWebComponent,
    ],
})
export class AppComponent {
  isLogin: boolean = isLogin
  fetchIng = true

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private i18n: NzI18nService,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {
    registerNotifyServices(notification, message)

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateDocumentTitle()
      }
    })
  }

  updateDocumentTitle() {
    const settings = navStore.settings()
    const url = this.router.url.split('?')[0].slice(1)
    const theme = (url === '' ? settings.theme : url).toLowerCase()
    const title = (settings as unknown as Record<string, string>)[
      `${theme}DocTitle`
    ]
    document.title = title || window.__TITLE__ || settings.title
  }

  ngOnInit() {
    this.goRoute()
    this.activatedRoute.queryParams.subscribe(setLocation)

    if (getLocale() === 'zh-CN') {
      this.i18n.setLocale(zh_CN)
    } else {
      this.i18n.setLocale(en_US)
    }

    const token = getToken()
    if (token) {
      verifyToken(token)
        .then((res) => {
          const data = res.data || {}
          if (!navStore.settings().email && data.email) {
            navStore.patchSettings({ email: data.email })
          }
          navStore.setGithubUserInfo(data)
        })
        .catch(() => {
          userLogout()
          setTimeout(() => {
            location.reload()
          }, 1000)
        })
    }

    const fetchPromise = dataProvider.fetchInitialData()
    fetchPromise.finally(() => {
      this.fetchIng = false
    })
  }

  goRoute() {
    const settings = navStore.settings()
    // is App
    if (settings.appTheme !== 'Current' && isMobile()) {
      const url = (this.router.url.split('?')[0] || '').toLowerCase()
      const { page, id, q } = queryString()
      const queryParams = { page, id, q }
      const path = '/' + String(settings.appTheme).toLowerCase()

      if (!url.includes(path)) {
        this.router.navigate([path], { queryParams })
      }
    }
  }
}
