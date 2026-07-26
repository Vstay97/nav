// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Routes } from '@angular/router'
import { isSelfDevelop } from 'src/utils/util'
import { getDefaultTheme } from 'src/utils'

export const routes: Routes = [
  {
    path: 'sim',
    loadComponent: () =>
      import('../view/sim/index.component').then((m) => m.SimComponent),
    data: {},
  },
  {
    path: 'super',
    loadComponent: () =>
      import('../view/super/index.component').then((m) => m.SuperComponent),
    data: {},
  },
  {
    path: 'side',
    loadComponent: () =>
      import('../view/side/index.component').then((m) => m.SideComponent),
    data: {},
  },
  {
    path: 'shortcut',
    loadComponent: () =>
      import('../view/shortcut/index.component').then(
        (m) => m.ShortcutComponent
      ),
    data: {},
  },
  {
    path: 'light',
    loadComponent: () =>
      import('../view/light/index.component').then((m) => m.LightComponent),
    data: {
      renderLinear: true,
      data: {},
    },
  },
  {
    path: 'app',
    loadComponent: () =>
      import('../view/app/default/app.component').then((m) => m.WebpComponent),
    data: {},
  },
  {
    path: 'system',
    loadComponent: () =>
      import('../view/system/index.component').then((m) => m.SystemComponent),
    children: [
      {
        path: 'info',
        loadComponent: () =>
          import('../view/system/info/index.component').then(
            (m) => m.SystemInfoComponent
          ),
      },
      {
        path: 'bookmark',
        loadComponent: () =>
          import('../view/system/bookmark/index.component').then(
            (m) => m.SystemBookmarkComponent
          ),
      },
      {
        path: 'bookmarkExport',
        loadComponent: () =>
          import('../view/system/bookmark-export/index.component').then(
            (m) => m.SystemBookmarkExportComponent
          ),
      },
      {
        path: 'collect',
        loadComponent: () =>
          import('../view/system/collect/index.component').then(
            (m) => m.CollectComponent
          ),
      },
      {
        path: 'vip',
        loadComponent: () =>
          import('../view/system/vip-auth/index.component').then(
            (m) => m.VipAuthComponent
          ),
      },
      {
        path: 'tag',
        loadComponent: () =>
          import('../view/system/tag/index.component').then(
            (m) => m.SystemTagComponent
          ),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('../view/system/search/index.component').then(
            (m) => m.SystemSearchComponent
          ),
      },
      {
        path: 'setting',
        loadComponent: () =>
          import('../view/system/setting/index.component').then(
            (m) => m.SystemSettingComponent
          ),
      },
      {
        path: 'component',
        loadComponent: () =>
          import('../view/system/component/index.component').then(
            (m) => m.SystemComponentComponent
          ),
      },
      {
        path: 'web',
        loadComponent: () =>
          import('../view/system/web/index.component').then(
            (m) => m.SystemWebComponent
          ),
      },
      {
        path: '**',
        redirectTo: '/system/web',
      },
    ],
  },
]

// 自有部署异步
if (!isSelfDevelop) {
  const defaultTheme = getDefaultTheme().toLowerCase()
  const hasDefault = routes.find((item) => item.path === defaultTheme)
  if (hasDefault) {
    routes.push({
      ...hasDefault,
      path: '**',
    })
  } else {
    routes.push({
      path: '**',
      redirectTo: '/' + defaultTheme,
    })
  }
}
