// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
// Modified by Vstay97, 2026

import { Routes } from '@angular/router'
import { isSelfDevelop } from 'src/utils/util'
import { getDefaultTheme } from 'src/utils'
import { THEME_REGISTRY } from 'src/view/themes.registry'

// 主题路由由注册表生成（新增主题只需在 themes.registry.ts 注册）
const themeRoutes: Routes = THEME_REGISTRY.map((t) => ({
  path: t.path,
  loadComponent: t.loadComponent,
  data: t.path === 'light' ? { renderLinear: true, data: {} } : {},
}))

export const routes: Routes = [
  ...themeRoutes,
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
