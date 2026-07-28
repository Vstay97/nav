// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
// Modified by Vstay97, 2026

import { Component, Renderer2 } from '@angular/core'
import { Router, ActivatedRoute, NavigationEnd, RouterOutlet } from '@angular/router'
import {
  queryString,
  setLocation,
  isMobile,
  computeFxClasses,
  ensureEffectDefaults,
} from '../utils'
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n'
import { getLocale } from 'src/locale'
import { navStore } from 'src/store/nav.store'
import { dataProvider } from 'src/providers'
import { getToken, userLogout, isLogin } from 'src/utils/user'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { registerNotifyServices } from 'src/services/notify'

import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { IconGitComponent } from '../components/icon-git/icon-git.component';
import { CreateWebComponent } from '../components/create-web/index.component';
import { MoveWebComponent } from '../components/move-web/index.component';
import { EffectsLayerComponent } from '../components/effects/effects-layer/index.component';
import { CursorGlowComponent } from '../components/effects/cursor-glow/index.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
    NzSpinComponent,
    IconGitComponent,
    RouterOutlet,
    CreateWebComponent,
    MoveWebComponent,
    EffectsLayerComponent,
    CursorGlowComponent
],
})
export class AppComponent {
  isLogin: boolean = isLogin
  fetchIng = true
  fxAuroraVisible = false
  fxCursorGlowVisible = false

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private i18n: NzI18nService,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private renderer: Renderer2
  ) {
    registerNotifyServices(notification, message)

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateDocumentTitle()
        this.applyFx()
      }
    })
  }

  /** 按当前设置与路由刷新 body 特效类与极光层/光晕显隐 */
  private applyFx() {
    const fx = computeFxClasses(navStore.settings(), this.router.url)
    this.fxAuroraVisible = fx.aurora
    this.fxCursorGlowVisible = fx.cursorGlow
    const body = document.body
    this.renderer[fx.aurora ? 'addClass' : 'removeClass'](body, 'fx-aurora')
    this.renderer[fx.glass ? 'addClass' : 'removeClass'](body, 'fx-glass')
    this.renderer[fx.tilt ? 'addClass' : 'removeClass'](body, 'fx-tilt')
    this.renderer[fx.parallax ? 'addClass' : 'removeClass'](body, 'fx-parallax')
    this.renderer[fx.cursorGlow ? 'addClass' : 'removeClass'](
      body,
      'fx-cursor-glow'
    )
    if (fx.aurora) {
      // 极光开启时清理 Light 主题遗留的随机渐变背景节点
      document.getElementById('random-light-bg')?.remove()
    }
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
      dataProvider.verifyToken(token)
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
      const patch = ensureEffectDefaults(navStore.settings())
      if (patch) {
        navStore.patchSettings(patch)
      }
      this.applyFx()
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
